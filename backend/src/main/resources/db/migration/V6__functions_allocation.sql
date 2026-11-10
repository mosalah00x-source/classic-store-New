-- Approximate great-circle distance (km). Use road-network ETA in application if required.
CREATE FUNCTION store.distance_km(lat1 numeric, lon1 numeric, lat2 numeric, lon2 numeric)
RETURNS double precision LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE AS $$
 SELECT 6371.0088 * 2 * asin(least(1.0,sqrt(
   power(sin(radians((lat2-lat1)::double precision)/2),2)
   + cos(radians(lat1::double precision))*cos(radians(lat2::double precision))
   * power(sin(radians((lon2-lon1)::double precision)/2),2))))
$$;
-- Read-only candidate ranking: one warehouse must have all lines in stock.
CREATE FUNCTION store.rank_warehouses(p_order_id uuid)
RETURNS TABLE(warehouse_id uuid, distance_km double precision, warehouse_priority integer)
LANGUAGE sql STABLE AS $$
 SELECT w.id,store.distance_km(o.shipping_latitude,o.shipping_longitude,w.latitude,w.longitude),w.priority
 FROM store.orders o CROSS JOIN store.warehouses w
 WHERE o.id=p_order_id AND o.shipping_latitude IS NOT NULL AND w.is_active
 AND w.country_code = COALESCE(o.shipping_address->>'country_code','EG')
 AND EXISTS (SELECT 1 FROM store.order_items oi WHERE oi.order_id=o.id)
 AND NOT EXISTS (
   SELECT 1 FROM store.order_items oi
   LEFT JOIN store.inventory i ON i.variant_id=oi.variant_id AND i.warehouse_id=w.id
   WHERE oi.order_id=o.id AND COALESCE(i.on_hand-i.reserved,0)<oi.quantity)
 ORDER BY 2,w.priority,w.id
$$;
-- Serializes allocation per order and globally per warehouse inventory by row locks.
-- Returns NULL when no single warehouse can cover all order lines.
CREATE FUNCTION store.reserve_order_at_nearest_warehouse(p_order_id uuid, p_ttl_minutes integer DEFAULT 15)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE v_warehouse uuid; v_candidate record; v_item record; v_order store.orders%ROWTYPE; v_ok boolean;
BEGIN
 IF p_ttl_minutes NOT BETWEEN 1 AND 1440 THEN RAISE EXCEPTION 'Invalid TTL'; END IF;
 SELECT * INTO v_order FROM store.orders WHERE id=p_order_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Order not found'; END IF;
 IF v_order.status <> 'PENDING' THEN RAISE EXCEPTION 'Order must be PENDING'; END IF;
 IF v_order.shipping_latitude IS NULL THEN RAISE EXCEPTION 'Shipping coordinates required'; END IF;
 IF EXISTS(SELECT 1 FROM store.inventory_reservations WHERE order_id=p_order_id AND status='ACTIVE') THEN
   RAISE EXCEPTION 'Order already reserved'; END IF;
 FOR v_candidate IN SELECT r.warehouse_id FROM store.rank_warehouses(p_order_id) r LOOP
   v_ok := true;
   -- Lock rows in consistent variant order, avoiding overselling under concurrency.
   FOR v_item IN SELECT oi.id AS item_id,oi.variant_id,oi.quantity FROM store.order_items oi
                 WHERE oi.order_id=p_order_id ORDER BY oi.variant_id LOOP
     PERFORM 1 FROM store.inventory i WHERE i.warehouse_id=v_candidate.warehouse_id
       AND i.variant_id=v_item.variant_id FOR UPDATE;
     IF NOT FOUND OR NOT EXISTS (
       SELECT 1 FROM store.inventory i WHERE i.warehouse_id=v_candidate.warehouse_id
       AND i.variant_id=v_item.variant_id AND i.on_hand-i.reserved >= v_item.quantity) THEN
       v_ok:=false; EXIT;
     END IF;
   END LOOP;
   IF v_ok THEN v_warehouse:=v_candidate.warehouse_id; EXIT; END IF;
 END LOOP;
 IF v_warehouse IS NULL THEN RETURN NULL; END IF;
 FOR v_item IN SELECT oi.id AS item_id,oi.variant_id,oi.quantity FROM store.order_items oi
               WHERE oi.order_id=p_order_id ORDER BY oi.variant_id LOOP
   UPDATE store.inventory SET reserved=reserved+v_item.quantity,updated_at=now()
   WHERE warehouse_id=v_warehouse AND variant_id=v_item.variant_id;
   INSERT INTO store.inventory_reservations(order_id,order_item_id,warehouse_id,variant_id,quantity,expires_at)
   VALUES(p_order_id,v_item.item_id,v_warehouse,v_item.variant_id,v_item.quantity,now()+make_interval(mins=>p_ttl_minutes));
   INSERT INTO store.inventory_movements(warehouse_id,variant_id,movement_type,quantity_delta,reserved_delta,reference_type,reference_id)
   VALUES(v_warehouse,v_item.variant_id,'RESERVE',0,v_item.quantity,'ORDER',p_order_id);
 END LOOP;
 INSERT INTO store.fulfillments(order_id,warehouse_id,status) VALUES(p_order_id,v_warehouse,'ALLOCATED')
 ON CONFLICT(order_id,warehouse_id) DO NOTHING;
 INSERT INTO store.fulfillment_items(fulfillment_id,order_item_id,quantity)
 SELECT f.id,oi.id,oi.quantity FROM store.fulfillments f JOIN store.order_items oi ON oi.order_id=f.order_id
 WHERE f.order_id=p_order_id AND f.warehouse_id=v_warehouse ON CONFLICT DO NOTHING;
 RETURN v_warehouse;
END $$;
CREATE FUNCTION store.release_order_reservations(p_order_id uuid)
RETURNS integer LANGUAGE plpgsql AS $$
DECLARE r record; n integer:=0;
BEGIN
 PERFORM 1 FROM store.orders WHERE id=p_order_id FOR UPDATE;
 FOR r IN SELECT * FROM store.inventory_reservations WHERE order_id=p_order_id AND status='ACTIVE'
          ORDER BY variant_id FOR UPDATE LOOP
   UPDATE store.inventory SET reserved=reserved-r.quantity,updated_at=now()
   WHERE warehouse_id=r.warehouse_id AND variant_id=r.variant_id;
   UPDATE store.inventory_reservations SET status='RELEASED',updated_at=now() WHERE id=r.id;
   INSERT INTO store.inventory_movements(warehouse_id,variant_id,movement_type,quantity_delta,reserved_delta,reference_type,reference_id)
   VALUES(r.warehouse_id,r.variant_id,'RELEASE',0,-r.quantity,'ORDER',p_order_id);
   n:=n+1;
 END LOOP;
 RETURN n;
END $$;
CREATE FUNCTION store.consume_order_reservations(p_order_id uuid)
RETURNS integer LANGUAGE plpgsql AS $$
DECLARE r record; n integer:=0;
BEGIN
 PERFORM 1 FROM store.orders WHERE id=p_order_id FOR UPDATE;
 FOR r IN SELECT * FROM store.inventory_reservations WHERE order_id=p_order_id AND status='ACTIVE'
          ORDER BY variant_id FOR UPDATE LOOP
   UPDATE store.inventory SET reserved=reserved-r.quantity,on_hand=on_hand-r.quantity,updated_at=now()
   WHERE warehouse_id=r.warehouse_id AND variant_id=r.variant_id;
   UPDATE store.inventory_reservations SET status='CONSUMED',updated_at=now() WHERE id=r.id;
   INSERT INTO store.inventory_movements(warehouse_id,variant_id,movement_type,quantity_delta,reserved_delta,reference_type,reference_id)
   VALUES(r.warehouse_id,r.variant_id,'SALE',-r.quantity,-r.quantity,'ORDER',p_order_id);
   n:=n+1;
 END LOOP;
 RETURN n;
END $$;

COMMENT ON FUNCTION store.distance_km(numeric, numeric, numeric, numeric) IS 'تحسب مسافة الدائرة العظمى التقريبية بالكيلومتر بين إحداثيين؛ لا تمثل مسافة الطريق.';
COMMENT ON FUNCTION store.rank_warehouses(uuid) IS 'ترتب المخازن النشطة القادرة على تغطية جميع بنود الطلب حسب المسافة ثم الأولوية ثم المعرّف.';
COMMENT ON FUNCTION store.reserve_order_at_nearest_warehouse(uuid, integer) IS 'تحجز كميات بنود الطلب في أقرب مخزن مؤهل مع قفل صفوف المخزون، وتنشئ سجل الحجز والتجهيز وحركات المخزون.';
COMMENT ON FUNCTION store.release_order_reservations(uuid) IS 'تحرر الحجوزات النشطة للطلب وتخفض الكمية المحجوزة وتسجل حركات التحرير.';
COMMENT ON FUNCTION store.consume_order_reservations(uuid) IS 'تستهلك الحجوزات النشطة للطلب وتخفض الرصيد الفعلي والمحجوز وتسجل حركات البيع.';
