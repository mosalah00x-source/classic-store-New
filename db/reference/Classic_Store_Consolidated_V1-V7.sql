-- CLASSIC STORE — CONSOLIDATED DATABASE SCRIPT
-- Composition: supplied classic_store_all.sql (base V1..V6) + supplied V7
-- + PostgreSQL comments sourced from DATA_DICTIONARY_DETAILED_AR.docx.
--
-- RUN ONLY ON A NEW / EMPTY DATABASE. Do not run over an existing installation.
-- This convenience file does not replace the individual ordered Flyway migrations.
-- It has NOT been executed against a live PostgreSQL server in this workspace.
-- Verify PostgreSQL version, extension permissions, and all tests before production.
-- DB naming convention: snake_case. REST camelCase conversion belongs in Java.
--
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE SCHEMA IF NOT EXISTS store;
CREATE TYPE store.user_role AS ENUM ('CUSTOMER','ADMIN','OPERATIONS','WAREHOUSE','SUPPORT');
CREATE TYPE store.product_status AS ENUM ('DRAFT','ACTIVE','ARCHIVED');
CREATE TYPE store.order_status AS ENUM ('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','RETURNED');
CREATE TYPE store.payment_status AS ENUM ('PENDING','AUTHORIZED','PAID','FAILED','REFUNDED','PARTIALLY_REFUNDED','CANCELLED');
CREATE TYPE store.payment_method AS ENUM ('COD','CARD','WALLET','OTHER');
CREATE TYPE store.fulfillment_status AS ENUM ('PENDING','ALLOCATED','PICKING','PACKED','DISPATCHED','DELIVERED','CANCELLED');
CREATE TYPE store.reservation_status AS ENUM ('ACTIVE','CONSUMED','RELEASED','EXPIRED');
CREATE TYPE store.stock_movement_type AS ENUM ('RECEIPT','ADJUSTMENT','RESERVE','RELEASE','SALE','RETURN','TRANSFER_IN','TRANSFER_OUT');
CREATE TABLE store.countries (code char(2) PRIMARY KEY, name_ar text NOT NULL, name_en text NOT NULL, is_enabled boolean NOT NULL DEFAULT false);
INSERT INTO store.countries VALUES ('EG','مصر','Egypt',true);
CREATE TABLE store.governorates (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, country_code char(2) NOT NULL REFERENCES store.countries(code), code varchar(24) NOT NULL, name_ar text NOT NULL, name_en text, UNIQUE(country_code,code));
CREATE TABLE store.cities (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, governorate_id bigint NOT NULL REFERENCES store.governorates(id), name_ar text NOT NULL, name_en text);
CREATE TABLE store.users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email citext UNIQUE, phone varchar(24) UNIQUE, password_hash text, first_name text, last_name text, role store.user_role NOT NULL DEFAULT 'CUSTOMER', is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), CHECK(email IS NOT NULL OR phone IS NOT NULL));
CREATE TABLE store.addresses (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES store.users(id) ON DELETE CASCADE, recipient_name text NOT NULL, phone varchar(24) NOT NULL, country_code char(2) NOT NULL DEFAULT 'EG' REFERENCES store.countries(code), governorate_id bigint REFERENCES store.governorates(id), city_id bigint REFERENCES store.cities(id), district text, street text NOT NULL, building text, apartment text, postal_code text, latitude numeric(9,6), longitude numeric(9,6), is_default boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), CHECK(latitude BETWEEN -90 AND 90), CHECK(longitude BETWEEN -180 AND 180), CHECK((latitude IS NULL) = (longitude IS NULL)));
CREATE UNIQUE INDEX ux_addresses_default ON store.addresses(user_id) WHERE is_default;
CREATE TABLE store.settings (key text PRIMARY KEY, value jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
INSERT INTO store.settings(key,value) VALUES ('currency', '"EGP"'::jsonb),('reservation_minutes','15'::jsonb);
COMMIT;
BEGIN;
CREATE TABLE store.brands (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, slug text NOT NULL UNIQUE, is_active boolean NOT NULL DEFAULT true);
CREATE TABLE store.categories (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), parent_id uuid REFERENCES store.categories(id) ON DELETE RESTRICT, name_ar text NOT NULL, name_en text, slug text NOT NULL UNIQUE, sort_order integer NOT NULL DEFAULT 0, is_active boolean NOT NULL DEFAULT true, CHECK(parent_id IS DISTINCT FROM id));
CREATE TABLE store.products (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), brand_id uuid REFERENCES store.brands(id), name_ar text NOT NULL, name_en text, slug text NOT NULL UNIQUE, description_ar text, description_en text, status store.product_status NOT NULL DEFAULT 'DRAFT', is_physical boolean NOT NULL DEFAULT true CHECK(is_physical), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE store.product_categories (product_id uuid NOT NULL REFERENCES store.products(id) ON DELETE CASCADE, category_id uuid NOT NULL REFERENCES store.categories(id) ON DELETE CASCADE, PRIMARY KEY(product_id,category_id));
CREATE TABLE store.product_variants (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid NOT NULL REFERENCES store.products(id) ON DELETE RESTRICT, sku text NOT NULL UNIQUE, barcode text UNIQUE, title_ar text, attributes jsonb NOT NULL DEFAULT '{}'::jsonb, price numeric(14,2) NOT NULL CHECK(price >= 0), compare_at_price numeric(14,2) CHECK(compare_at_price >= 0), cost numeric(14,2) CHECK(cost >= 0), weight_grams integer NOT NULL DEFAULT 0 CHECK(weight_grams >= 0), length_mm integer CHECK(length_mm > 0), width_mm integer CHECK(width_mm > 0), height_mm integer CHECK(height_mm > 0), is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,product_id));
CREATE TABLE store.product_images (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), product_id uuid NOT NULL REFERENCES store.products(id) ON DELETE CASCADE, variant_id uuid, image_url text NOT NULL, alt_ar text, sort_order integer NOT NULL DEFAULT 0, FOREIGN KEY(variant_id,product_id) REFERENCES store.product_variants(id,product_id));
CREATE TABLE store.coupons (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code citext NOT NULL UNIQUE, discount_type text NOT NULL CHECK(discount_type IN ('PERCENT','FIXED')), discount_value numeric(14,2) NOT NULL CHECK(discount_value > 0), min_order_amount numeric(14,2) NOT NULL DEFAULT 0 CHECK(min_order_amount >= 0), max_discount numeric(14,2) CHECK(max_discount > 0), starts_at timestamptz, ends_at timestamptz, usage_limit integer CHECK(usage_limit > 0), used_count integer NOT NULL DEFAULT 0 CHECK(used_count >= 0), is_active boolean NOT NULL DEFAULT true, CHECK(discount_type <> 'PERCENT' OR discount_value <= 100), CHECK(ends_at IS NULL OR starts_at IS NULL OR ends_at > starts_at));
CREATE INDEX ix_products_status ON store.products(status);
CREATE INDEX ix_variants_product ON store.product_variants(product_id);
CREATE INDEX ix_categories_parent ON store.categories(parent_id);
COMMIT;
BEGIN;
CREATE TABLE store.warehouses (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code text NOT NULL UNIQUE, name text NOT NULL, country_code char(2) NOT NULL DEFAULT 'EG' REFERENCES store.countries(code), governorate_id bigint REFERENCES store.governorates(id), city_id bigint REFERENCES store.cities(id), address_line text NOT NULL, latitude numeric(9,6) NOT NULL CHECK(latitude BETWEEN -90 AND 90), longitude numeric(9,6) NOT NULL CHECK(longitude BETWEEN -180 AND 180), priority integer NOT NULL DEFAULT 100, is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE store.inventory (warehouse_id uuid NOT NULL REFERENCES store.warehouses(id), variant_id uuid NOT NULL REFERENCES store.product_variants(id), on_hand integer NOT NULL DEFAULT 0 CHECK(on_hand >= 0), reserved integer NOT NULL DEFAULT 0 CHECK(reserved >= 0), reorder_point integer NOT NULL DEFAULT 0 CHECK(reorder_point >= 0), updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(warehouse_id,variant_id), CHECK(reserved <= on_hand));
CREATE TABLE store.inventory_movements (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, warehouse_id uuid NOT NULL REFERENCES store.warehouses(id), variant_id uuid NOT NULL REFERENCES store.product_variants(id), movement_type store.stock_movement_type NOT NULL, quantity_delta integer NOT NULL, reserved_delta integer NOT NULL DEFAULT 0, reference_type text, reference_id uuid, note text, actor_user_id uuid REFERENCES store.users(id), created_at timestamptz NOT NULL DEFAULT now(), CHECK(quantity_delta <> 0 OR reserved_delta <> 0));
CREATE INDEX ix_inventory_variant ON store.inventory(variant_id);
CREATE INDEX ix_inventory_movements_lookup ON store.inventory_movements(warehouse_id,variant_id,created_at DESC);
COMMIT;
BEGIN;
CREATE TABLE store.carts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES store.users(id) ON DELETE SET NULL, guest_token_hash text UNIQUE, currency char(3) NOT NULL DEFAULT 'EGP', expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), CHECK(user_id IS NOT NULL OR guest_token_hash IS NOT NULL));
CREATE TABLE store.cart_items (cart_id uuid NOT NULL REFERENCES store.carts(id) ON DELETE CASCADE, variant_id uuid NOT NULL REFERENCES store.product_variants(id), quantity integer NOT NULL CHECK(quantity > 0), PRIMARY KEY(cart_id,variant_id));
CREATE TABLE store.orders (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_number bigint GENERATED ALWAYS AS IDENTITY UNIQUE, user_id uuid REFERENCES store.users(id) ON DELETE SET NULL, guest_email citext, guest_phone varchar(24), customer_name text NOT NULL, customer_email citext, customer_phone varchar(24) NOT NULL, status store.order_status NOT NULL DEFAULT 'PENDING', payment_status store.payment_status NOT NULL DEFAULT 'PENDING', currency char(3) NOT NULL DEFAULT 'EGP', subtotal numeric(14,2) NOT NULL CHECK(subtotal >= 0), discount_total numeric(14,2) NOT NULL DEFAULT 0 CHECK(discount_total >= 0), shipping_total numeric(14,2) NOT NULL DEFAULT 0 CHECK(shipping_total >= 0), tax_total numeric(14,2) NOT NULL DEFAULT 0 CHECK(tax_total >= 0), grand_total numeric(14,2) GENERATED ALWAYS AS (subtotal-discount_total+shipping_total+tax_total) STORED, coupon_id uuid REFERENCES store.coupons(id), shipping_address jsonb NOT NULL, billing_address jsonb, shipping_latitude numeric(9,6), shipping_longitude numeric(9,6), notes text, placed_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), CHECK(user_id IS NOT NULL OR guest_phone IS NOT NULL OR guest_email IS NOT NULL), CHECK(discount_total <= subtotal), CHECK(shipping_latitude BETWEEN -90 AND 90), CHECK(shipping_longitude BETWEEN -180 AND 180), CHECK((shipping_latitude IS NULL) = (shipping_longitude IS NULL)));
CREATE TABLE store.order_items (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES store.orders(id) ON DELETE RESTRICT, variant_id uuid NOT NULL REFERENCES store.product_variants(id), sku_snapshot text NOT NULL, product_name_snapshot text NOT NULL, variant_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb, quantity integer NOT NULL CHECK(quantity > 0), unit_price numeric(14,2) NOT NULL CHECK(unit_price >= 0), discount_amount numeric(14,2) NOT NULL DEFAULT 0 CHECK(discount_amount >= 0), line_total numeric(14,2) GENERATED ALWAYS AS (quantity*unit_price-discount_amount) STORED, CHECK(discount_amount <= quantity*unit_price), UNIQUE(order_id,variant_id));
CREATE TABLE store.order_status_history (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, order_id uuid NOT NULL REFERENCES store.orders(id), old_status store.order_status, new_status store.order_status NOT NULL, changed_by uuid REFERENCES store.users(id), note text, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE store.fulfillments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES store.orders(id), warehouse_id uuid NOT NULL REFERENCES store.warehouses(id), status store.fulfillment_status NOT NULL DEFAULT 'PENDING', shipping_provider text, tracking_number text, shipped_at timestamptz, delivered_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(order_id,warehouse_id));
CREATE TABLE store.fulfillment_items (fulfillment_id uuid NOT NULL REFERENCES store.fulfillments(id), order_item_id uuid NOT NULL REFERENCES store.order_items(id), quantity integer NOT NULL CHECK(quantity > 0), PRIMARY KEY(fulfillment_id,order_item_id));
CREATE TABLE store.inventory_reservations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES store.orders(id), order_item_id uuid NOT NULL REFERENCES store.order_items(id), warehouse_id uuid NOT NULL REFERENCES store.warehouses(id), variant_id uuid NOT NULL REFERENCES store.product_variants(id), quantity integer NOT NULL CHECK(quantity > 0), status store.reservation_status NOT NULL DEFAULT 'ACTIVE', expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(order_item_id,warehouse_id));
CREATE INDEX ix_orders_user_date ON store.orders(user_id,placed_at DESC);
CREATE INDEX ix_orders_status_date ON store.orders(status,placed_at DESC);
CREATE INDEX ix_reservations_expiry ON store.inventory_reservations(expires_at) WHERE status='ACTIVE';
COMMIT;
BEGIN;
CREATE TABLE store.payments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES store.orders(id), method store.payment_method NOT NULL, status store.payment_status NOT NULL DEFAULT 'PENDING', provider text, provider_payment_id text, amount numeric(14,2) NOT NULL CHECK(amount >= 0), currency char(3) NOT NULL DEFAULT 'EGP', idempotency_key text NOT NULL UNIQUE, paid_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(provider,provider_payment_id));
CREATE TABLE store.payment_events (id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, payment_id uuid NOT NULL REFERENCES store.payments(id), provider_event_id text, event_type text NOT NULL, payload jsonb NOT NULL, received_at timestamptz NOT NULL DEFAULT now(), UNIQUE(payment_id,provider_event_id));
CREATE TABLE store.refunds (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), payment_id uuid NOT NULL REFERENCES store.payments(id), amount numeric(14,2) NOT NULL CHECK(amount > 0), reason text, provider_refund_id text UNIQUE, status text NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING','SUCCEEDED','FAILED')), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE store.shipping_zones (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, country_code char(2) NOT NULL REFERENCES store.countries(code), governorate_id bigint REFERENCES store.governorates(id), is_active boolean NOT NULL DEFAULT true);
CREATE TABLE store.shipping_rates (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), zone_id uuid NOT NULL REFERENCES store.shipping_zones(id), min_weight_grams integer NOT NULL DEFAULT 0 CHECK(min_weight_grams >= 0), max_weight_grams integer CHECK(max_weight_grams > 0), amount numeric(14,2) NOT NULL CHECK(amount >= 0), currency char(3) NOT NULL DEFAULT 'EGP', CHECK(max_weight_grams IS NULL OR max_weight_grams > min_weight_grams));
CREATE TABLE store.returns (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES store.orders(id), status text NOT NULL DEFAULT 'REQUESTED' CHECK(status IN ('REQUESTED','APPROVED','REJECTED','RECEIVED','REFUNDED')), reason text, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE store.return_items (return_id uuid NOT NULL REFERENCES store.returns(id), order_item_id uuid NOT NULL REFERENCES store.order_items(id), quantity integer NOT NULL CHECK(quantity > 0), PRIMARY KEY(return_id,order_item_id));
CREATE TABLE store.outbox_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), aggregate_type text NOT NULL, aggregate_id uuid NOT NULL, event_type text NOT NULL, payload jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), published_at timestamptz, attempts integer NOT NULL DEFAULT 0);
CREATE INDEX ix_outbox_unpublished ON store.outbox_events(created_at) WHERE published_at IS NULL;
CREATE INDEX ix_payments_order ON store.payments(order_id);
COMMIT;
BEGIN;
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
COMMIT;

-- ================= V7: INTEGRITY AND RESERVATION HARDENING =================

-- Classic Store — V7: integrity & reservation hardening
--
-- PURPOSE
--   1) Allow a reservation for the same (order_item, warehouse) to be
--      recreated after the previous reservation was RELEASED or EXPIRED.
--   2) Keep at most one ACTIVE reservation for the same (order_item, warehouse).
--   3) Harden cross-entity integrity for order items, fulfillment items and
--      inventory reservations.
--
-- SCOPE / IMPORTANT DECISIONS
--   - Apply only after V1..V6.
--   - V1..V6 are not modified.
--   - V6 allocation functions remain in the database unchanged.
--   - The application Java service owns allocation/reservation execution and
--     must not call the V6 allocation functions.
--   - No updated_at trigger is introduced here; automatic timestamp handling
--     is intentionally deferred to a separately approved migration.
--   - JSON convention: DB JSON uses snake_case (for example country_code).
--     REST camelCase conversion belongs in the Java mapper layer.
--
-- PostgreSQL: transactional DDL. Flyway migration.

BEGIN;

/* -------------------------------------------------------------------------
   1. Reservation uniqueness hardening
   -------------------------------------------------------------------------

   V4 created:
     UNIQUE(order_item_id, warehouse_id)

   That constraint incorrectly makes historical RELEASED/EXPIRED rows block a
   later reservation for the same order item and warehouse.

   Desired invariant:
     - Historical reservations may coexist.
     - There can be no more than one ACTIVE reservation for the same
       (order_item_id, warehouse_id).
*/

ALTER TABLE store.inventory_reservations
    DROP CONSTRAINT IF EXISTS inventory_reservations_order_item_id_warehouse_id_key;

-- Fail explicitly if existing data already violates the new ACTIVE-only rule.
DO $$
DECLARE
    v_duplicate_count integer;
BEGIN
    SELECT count(*)
      INTO v_duplicate_count
      FROM (
          SELECT order_item_id, warehouse_id
            FROM store.inventory_reservations
           WHERE status = 'ACTIVE'
           GROUP BY order_item_id, warehouse_id
          HAVING count(*) > 1
      ) d;

    IF v_duplicate_count > 0 THEN
        RAISE EXCEPTION
            'V7 cannot create ACTIVE reservation uniqueness: % duplicate group(s) already exist',
            v_duplicate_count;
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS ux_inventory_reservations_active_item_warehouse
    ON store.inventory_reservations(order_item_id, warehouse_id)
    WHERE status = 'ACTIVE';

/* -------------------------------------------------------------------------
   2. Freeze order-item snapshots after allocation
   -------------------------------------------------------------------------

   Once an order has a reservation or fulfillment, its line snapshot must not
   be changed. This protects SKU/product/price/quantity consistency after
   inventory allocation.
*/

CREATE OR REPLACE FUNCTION store.guard_order_item_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_order_id uuid;
BEGIN
    v_order_id := CASE
        WHEN TG_OP = 'DELETE' THEN OLD.order_id
        ELSE NEW.order_id
    END;

    IF TG_OP = 'UPDATE' AND NEW.order_id IS DISTINCT FROM OLD.order_id THEN
        RAISE EXCEPTION 'Moving an order item between orders is prohibited';
    END IF;

    -- Serialize item mutation with allocation/reservation work for this order.
    PERFORM 1
      FROM store.orders
     WHERE id = v_order_id
     FOR UPDATE;

    IF EXISTS (
        SELECT 1
          FROM store.inventory_reservations
         WHERE order_id = v_order_id
    )
    OR EXISTS (
        SELECT 1
          FROM store.fulfillments
         WHERE order_id = v_order_id
    ) THEN
        RAISE EXCEPTION 'Order items are immutable after allocation';
    END IF;

    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_order_items ON store.order_items;

CREATE TRIGGER trg_guard_order_items
BEFORE INSERT OR UPDATE OR DELETE
ON store.order_items
FOR EACH ROW
EXECUTE FUNCTION store.guard_order_item_mutation();

/* -------------------------------------------------------------------------
   3. Fulfillment-item ownership integrity
   -------------------------------------------------------------------------

   A fulfillment item must reference an order item belonging to the same
   order as the fulfillment itself.
*/

CREATE OR REPLACE FUNCTION store.guard_fulfillment_item()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
          FROM store.fulfillments f
          JOIN store.order_items oi
            ON oi.order_id = f.order_id
         WHERE f.id = NEW.fulfillment_id
           AND oi.id = NEW.order_item_id
    ) THEN
        RAISE EXCEPTION 'Fulfillment item must belong to fulfillment order';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_fulfillment_items ON store.fulfillment_items;

CREATE TRIGGER trg_guard_fulfillment_items
BEFORE INSERT OR UPDATE
ON store.fulfillment_items
FOR EACH ROW
EXECUTE FUNCTION store.guard_fulfillment_item();

/* -------------------------------------------------------------------------
   4. Reservation ownership / variant integrity
   -------------------------------------------------------------------------

   order_id, order_item_id and variant_id must describe the same order line.
   This prevents a reservation from being attached to an unrelated SKU.
*/

CREATE OR REPLACE FUNCTION store.guard_inventory_reservation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
          FROM store.order_items oi
         WHERE oi.id = NEW.order_item_id
           AND oi.order_id = NEW.order_id
           AND oi.variant_id = NEW.variant_id
    ) THEN
        RAISE EXCEPTION 'Reservation item, variant and order mismatch';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_inventory_reservations
    ON store.inventory_reservations;

CREATE TRIGGER trg_guard_inventory_reservations
BEFORE INSERT OR UPDATE
ON store.inventory_reservations
FOR EACH ROW
EXECUTE FUNCTION store.guard_inventory_reservation();

COMMIT;

/* -------------------------------------------------------------------------
   V7 RESULTING CONTRACT

   inventory_reservations uniqueness:
       ACTIVE only -> unique(order_item_id, warehouse_id)
       RELEASED    -> historical row allowed
       EXPIRED     -> historical row allowed
       CONSUMED    -> historical row allowed

   Example lifecycle now supported:
       ACTIVE -> RELEASED -> new ACTIVE row for same item + warehouse
       ACTIVE -> EXPIRED  -> new ACTIVE row for same item + warehouse

   Allocation ordering / locking remains an application responsibility:
       variant_id first, then warehouse/inventory rows in deterministic order.
   ------------------------------------------------------------------------- */

-- -----------------------------------------------------------------------------
-- COMMENTS sourced from DATA_DICTIONARY_DETAILED_AR.docx
-- -----------------------------------------------------------------------------
COMMENT ON SCHEMA store IS 'المخطط الرئيسي لقاعدة بيانات Classic Store.';
COMMENT ON TYPE store.user_role IS 'أدوار المستخدمين والموظفين في النظام.';
COMMENT ON TYPE store.product_status IS 'حالات نشر المنتج في الكتالوج.';
COMMENT ON TYPE store.order_status IS 'حالات دورة حياة الطلب.';
COMMENT ON TYPE store.payment_status IS 'حالات عملية الدفع.';
COMMENT ON TYPE store.payment_method IS 'طرق الدفع المدعومة في النظام.';
COMMENT ON TYPE store.fulfillment_status IS 'حالات تجهيز وشحن الطلب.';
COMMENT ON TYPE store.reservation_status IS 'حالات حجز المخزون.';
COMMENT ON TYPE store.stock_movement_type IS 'أنواع حركات المخزون.';
COMMENT ON TABLE store.countries IS 'الدول المتاحة في النظام؛ يبدأ المتجر بمصر، ويمكن تفعيل دول أخرى لاحقًا';
COMMENT ON COLUMN store.countries.code IS 'الرمز — رمز أعمال يُستخدم في التعريف والبحث والربط.';
COMMENT ON COLUMN store.countries.name_ar IS 'الاسم بالعربية — الاسم المترجم لعرضه في واجهة اللغة المناسبة.';
COMMENT ON COLUMN store.countries.name_en IS 'الاسم بالإنجليزية — الاسم المترجم لعرضه في واجهة اللغة المناسبة.';
COMMENT ON COLUMN store.countries.is_enabled IS 'مفعّل — علامة لتفعيل/تعطيل السجل دون حذفه من قاعدة البيانات.';
COMMENT ON TABLE store.governorates IS 'تعريف المحافظات التابعة لكل دولة لاستخدامها في العناوين والتوصيل';
COMMENT ON COLUMN store.governorates.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.governorates.country_code IS 'رمز الدولة — رمز الدولة لربط السجل بدولة التشغيل والتوصيل.';
COMMENT ON COLUMN store.governorates.code IS 'الرمز — رمز أعمال يُستخدم في التعريف والبحث والربط.';
COMMENT ON COLUMN store.governorates.name_ar IS 'الاسم بالعربية — الاسم المترجم لعرضه في واجهة اللغة المناسبة.';
COMMENT ON COLUMN store.governorates.name_en IS 'الاسم بالإنجليزية — الاسم المترجم لعرضه في واجهة اللغة المناسبة.';
COMMENT ON TABLE store.cities IS 'تعريف المدن وربطها بالمحافظات لتحسين إدخال العناوين';
COMMENT ON COLUMN store.cities.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.cities.governorate_id IS 'معرّف المحافظة — مرجع يربط السجل بكيان governorate ذي الصلة.';
COMMENT ON COLUMN store.cities.name_ar IS 'الاسم بالعربية — الاسم المترجم لعرضه في واجهة اللغة المناسبة.';
COMMENT ON COLUMN store.cities.name_en IS 'الاسم بالإنجليزية — الاسم المترجم لعرضه في واجهة اللغة المناسبة.';
COMMENT ON TABLE store.users IS 'حسابات العملاء والموظفين وصلاحياتهم؛ لا يُشترط وجود سجل للزائر';
COMMENT ON COLUMN store.users.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.users.email IS 'البريد الإلكتروني — عنوان بريد إلكتروني للتواصل والإشعارات.';
COMMENT ON COLUMN store.users.phone IS 'رقم الهاتف — رقم هاتف للتواصل أو التحقق أو تسليم الطلب.';
COMMENT ON COLUMN store.users.password_hash IS 'تجزئة كلمة المرور — تجزئة آمنة لكلمة المرور؛ لا تحفظ كلمة المرور كنص.';
COMMENT ON COLUMN store.users.first_name IS 'الاسم الأول — الاسم الأول؛ يُستخدم ضمن عمليات حسابات العملاء والموظفين وصلاحياتهم.';
COMMENT ON COLUMN store.users.last_name IS 'اسم العائلة — اسم العائلة؛ يُستخدم ضمن عمليات حسابات العملاء والموظفين وصلاحياتهم.';
COMMENT ON COLUMN store.users.role IS 'الدور — الدور؛ يُستخدم ضمن عمليات حسابات العملاء والموظفين وصلاحياتهم.';
COMMENT ON COLUMN store.users.is_active IS 'نشط — علامة لتفعيل/تعطيل السجل دون حذفه من قاعدة البيانات.';
COMMENT ON COLUMN store.users.created_at IS 'تاريخ الإنشاء — وقت إنشاء السجل لأغراض التدقيق والتقارير.';
COMMENT ON COLUMN store.users.updated_at IS 'تاريخ التحديث — آخر وقت لتعديل السجل؛ يجب تحديثه عند التغيير بواسطة التطبيق أو trigger.';
COMMENT ON TABLE store.addresses IS 'دفتر العناوين المحفوظة للعملاء المسجلين؛ لا يعتمد عليه طلب الزائر';
COMMENT ON COLUMN store.addresses.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.addresses.user_id IS 'معرّف المستخدم — مرجع يربط السجل بكيان user ذي الصلة.';
COMMENT ON COLUMN store.addresses.recipient_name IS 'اسم المستلم — اسم المستلم؛ يُستخدم ضمن عمليات دفتر العناوين المحفوظة للعملاء المسجلين.';
COMMENT ON COLUMN store.addresses.phone IS 'رقم الهاتف — رقم هاتف للتواصل أو التحقق أو تسليم الطلب.';
COMMENT ON COLUMN store.addresses.country_code IS 'رمز الدولة — رمز الدولة لربط السجل بدولة التشغيل والتوصيل.';
COMMENT ON COLUMN store.addresses.governorate_id IS 'معرّف المحافظة — مرجع يربط السجل بكيان governorate ذي الصلة.';
COMMENT ON COLUMN store.addresses.city_id IS 'معرّف المدينة — مرجع يربط السجل بكيان city ذي الصلة.';
COMMENT ON COLUMN store.addresses.district IS 'الحي — الحي؛ يُستخدم ضمن عمليات دفتر العناوين المحفوظة للعملاء المسجلين.';
COMMENT ON COLUMN store.addresses.street IS 'الشارع — الشارع؛ يُستخدم ضمن عمليات دفتر العناوين المحفوظة للعملاء المسجلين.';
COMMENT ON COLUMN store.addresses.building IS 'المبنى — المبنى؛ يُستخدم ضمن عمليات دفتر العناوين المحفوظة للعملاء المسجلين.';
COMMENT ON COLUMN store.addresses.apartment IS 'الشقة — الشقة؛ يُستخدم ضمن عمليات دفتر العناوين المحفوظة للعملاء المسجلين.';
COMMENT ON COLUMN store.addresses.postal_code IS 'الرمز البريدي — الرمز البريدي؛ يُستخدم ضمن عمليات دفتر العناوين المحفوظة للعملاء المسجلين.';
COMMENT ON COLUMN store.addresses.latitude IS 'خط العرض — خط العرض الجغرافي لتحديد موقع العنوان أو المخزن.';
COMMENT ON COLUMN store.addresses.longitude IS 'خط الطول — خط الطول الجغرافي لتحديد موقع العنوان أو المخزن.';
COMMENT ON COLUMN store.addresses.is_default IS 'العنوان الافتراضي — العنوان الافتراضي؛ يُستخدم ضمن عمليات دفتر العناوين المحفوظة للعملاء المسجلين.';
COMMENT ON COLUMN store.addresses.created_at IS 'تاريخ الإنشاء — وقت إنشاء السجل لأغراض التدقيق والتقارير.';
COMMENT ON TABLE store.settings IS 'إعدادات المتجر العامة المخزنة في JSON مثل العملة ومدة الحجز';
COMMENT ON COLUMN store.settings.key IS 'المفتاح — المفتاح؛ يُستخدم ضمن عمليات إعدادات المتجر العامة المخزنة في JSON مثل العملة ومدة الحجز..';
COMMENT ON COLUMN store.settings.value IS 'القيمة — القيمة؛ يُستخدم ضمن عمليات إعدادات المتجر العامة المخزنة في JSON مثل العملة ومدة الحجز..';
COMMENT ON COLUMN store.settings.updated_at IS 'تاريخ التحديث — آخر وقت لتعديل السجل؛ يجب تحديثه عند التغيير بواسطة التطبيق أو trigger.';
COMMENT ON TABLE store.brands IS 'العلامات التجارية المستخدمة في تصفية المنتجات';
COMMENT ON COLUMN store.brands.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.brands.name IS 'الاسم — الاسم؛ يُستخدم ضمن عمليات العلامات التجارية المستخدمة في تصفية المنتجات..';
COMMENT ON COLUMN store.brands.slug IS 'المعرّف النصي للرابط — معرّف مناسب لرابط صفحة المنتج أو التصنيف أو العلامة.';
COMMENT ON COLUMN store.brands.is_active IS 'نشط — علامة لتفعيل/تعطيل السجل دون حذفه من قاعدة البيانات.';
COMMENT ON TABLE store.categories IS 'التصنيفات الهرمية لعرض الكتالوج والتنقل';
COMMENT ON COLUMN store.categories.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.categories.parent_id IS 'معرّف التصنيف الأب — مرجع يربط السجل بكيان parent ذي الصلة.';
COMMENT ON COLUMN store.categories.name_ar IS 'الاسم بالعربية — الاسم المترجم لعرضه في واجهة اللغة المناسبة.';
COMMENT ON COLUMN store.categories.name_en IS 'الاسم بالإنجليزية — الاسم المترجم لعرضه في واجهة اللغة المناسبة.';
COMMENT ON COLUMN store.categories.slug IS 'المعرّف النصي للرابط — معرّف مناسب لرابط صفحة المنتج أو التصنيف أو العلامة.';
COMMENT ON COLUMN store.categories.sort_order IS 'ترتيب العرض — قيمة لترتيب عرض العناصر في واجهة المتجر.';
COMMENT ON COLUMN store.categories.is_active IS 'نشط — علامة لتفعيل/تعطيل السجل دون حذفه من قاعدة البيانات.';
COMMENT ON TABLE store.products IS 'البيانات العامة للمنتج المادي بصرف النظر عن خياراته القابلة للبيع';
COMMENT ON COLUMN store.products.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.products.brand_id IS 'معرّف العلامة التجارية — مرجع يربط السجل بكيان brand ذي الصلة.';
COMMENT ON COLUMN store.products.name_ar IS 'الاسم بالعربية — الاسم المترجم لعرضه في واجهة اللغة المناسبة.';
COMMENT ON COLUMN store.products.name_en IS 'الاسم بالإنجليزية — الاسم المترجم لعرضه في واجهة اللغة المناسبة.';
COMMENT ON COLUMN store.products.slug IS 'المعرّف النصي للرابط — معرّف مناسب لرابط صفحة المنتج أو التصنيف أو العلامة.';
COMMENT ON COLUMN store.products.description_ar IS 'الوصف بالعربية — وصف تفصيلي باللغة المحددة لصفحة المنتج.';
COMMENT ON COLUMN store.products.description_en IS 'الوصف بالإنجليزية — وصف تفصيلي باللغة المحددة لصفحة المنتج.';
COMMENT ON COLUMN store.products.status IS 'الحالة — الحالة التشغيلية للسجل؛ تُستخدم لتحديد الإجراءات المسموحة والتقارير.';
COMMENT ON COLUMN store.products.is_physical IS 'منتج مادي — منتج مادي؛ يُستخدم ضمن عمليات البيانات العامة للمنتج المادي بصرف النظر عن خياراته القابلة للبيع..';
COMMENT ON COLUMN store.products.created_at IS 'تاريخ الإنشاء — وقت إنشاء السجل لأغراض التدقيق والتقارير.';
COMMENT ON COLUMN store.products.updated_at IS 'تاريخ التحديث — آخر وقت لتعديل السجل؛ يجب تحديثه عند التغيير بواسطة التطبيق أو trigger.';
COMMENT ON TABLE store.product_categories IS 'ربط متعدد إلى متعدد بين المنتجات والتصنيفات';
COMMENT ON COLUMN store.product_categories.product_id IS 'معرّف المنتج — مرجع يربط السجل بكيان product ذي الصلة.';
COMMENT ON COLUMN store.product_categories.category_id IS 'معرّف التصنيف — مرجع يربط السجل بكيان category ذي الصلة.';
COMMENT ON TABLE store.product_variants IS 'الوحدات الفعلية القابلة للبيع SKU وأسعارها وأبعادها';
COMMENT ON COLUMN store.product_variants.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.product_variants.product_id IS 'معرّف المنتج — مرجع يربط السجل بكيان product ذي الصلة.';
COMMENT ON COLUMN store.product_variants.sku IS 'رمز وحدة المخزون — رمز فريد لتعريف الوحدة البيعية وربطها بالمخزون.';
COMMENT ON COLUMN store.product_variants.barcode IS 'الباركود — الباركود؛ يُستخدم ضمن عمليات الوحدات الفعلية القابلة للبيع SKU وأسعارها وأبعادها..';
COMMENT ON COLUMN store.product_variants.title_ar IS 'عنوان المتغير بالعربية — عنوان المتغير بالعربية؛ يُستخدم ضمن عمليات الوحدات الفعلية القابلة للبيع SKU وأسعارها وأبعادها..';
COMMENT ON COLUMN store.product_variants.attributes IS 'الخصائص — خصائص المتغير بصيغة JSON مثل اللون والمقاس.';
COMMENT ON COLUMN store.product_variants.price IS 'السعر — قيمة مالية تُستخدم في التسعير أو الحساب أو التسوية وفق سياق الجدول.';
COMMENT ON COLUMN store.product_variants.compare_at_price IS 'السعر قبل الخصم — سعر مرجعي سابق لإظهار التخفيض عند الحاجة.';
COMMENT ON COLUMN store.product_variants.cost IS 'التكلفة — تكلفة الوحدة داخليًا لحساب هامش الربح، لا تُعرض للعميل.';
COMMENT ON COLUMN store.product_variants.weight_grams IS 'الوزن بالجرام — وزن بالجرام يستخدم في حساب الشحن والتحقق من الشرائح.';
COMMENT ON COLUMN store.product_variants.length_mm IS 'الطول بالمليمتر — بُعد بالمليمتر يستخدم في تقدير التغليف والشحن.';
COMMENT ON COLUMN store.product_variants.width_mm IS 'العرض بالمليمتر — بُعد بالمليمتر يستخدم في تقدير التغليف والشحن.';
COMMENT ON COLUMN store.product_variants.height_mm IS 'الارتفاع بالمليمتر — بُعد بالمليمتر يستخدم في تقدير التغليف والشحن.';
COMMENT ON COLUMN store.product_variants.is_active IS 'نشط — علامة لتفعيل/تعطيل السجل دون حذفه من قاعدة البيانات.';
COMMENT ON COLUMN store.product_variants.created_at IS 'تاريخ الإنشاء — وقت إنشاء السجل لأغراض التدقيق والتقارير.';
COMMENT ON TABLE store.product_images IS 'صور المنتج أو متغير محدد وترتيب ظهورها';
COMMENT ON COLUMN store.product_images.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.product_images.product_id IS 'معرّف المنتج — مرجع يربط السجل بكيان product ذي الصلة.';
COMMENT ON COLUMN store.product_images.variant_id IS 'معرّف متغير المنتج — مرجع يربط السجل بكيان variant ذي الصلة.';
COMMENT ON COLUMN store.product_images.image_url IS 'رابط الصورة — رابط الصورة؛ يُستخدم ضمن عمليات صور المنتج أو متغير محدد وترتيب ظهورها..';
COMMENT ON COLUMN store.product_images.alt_ar IS 'النص البديل بالعربية — النص البديل بالعربية؛ يُستخدم ضمن عمليات صور المنتج أو متغير محدد وترتيب ظهورها..';
COMMENT ON COLUMN store.product_images.sort_order IS 'ترتيب العرض — قيمة لترتيب عرض العناصر في واجهة المتجر.';
COMMENT ON TABLE store.coupons IS 'أكواد الخصم وشروط الصلاحية والاستخدام';
COMMENT ON COLUMN store.coupons.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.coupons.code IS 'الرمز — رمز أعمال يُستخدم في التعريف والبحث والربط.';
COMMENT ON COLUMN store.coupons.discount_type IS 'نوع الخصم — نوع الخصم؛ يُستخدم ضمن عمليات أكواد الخصم وشروط الصلاحية والاستخدام..';
COMMENT ON COLUMN store.coupons.discount_value IS 'قيمة الخصم — قيمة مالية تُستخدم في التسعير أو الحساب أو التسوية وفق سياق الجدول.';
COMMENT ON COLUMN store.coupons.min_order_amount IS 'الحد الأدنى للطلب — قيمة مالية تُستخدم في التسعير أو الحساب أو التسوية وفق سياق الجدول.';
COMMENT ON COLUMN store.coupons.max_discount IS 'الحد الأقصى للخصم — قيمة مالية تُستخدم في التسعير أو الحساب أو التسوية وفق سياق الجدول.';
COMMENT ON COLUMN store.coupons.starts_at IS 'بداية الصلاحية — طابع زمني يستخدم للتتبع أو التحكم في دورة حياة العملية.';
COMMENT ON COLUMN store.coupons.ends_at IS 'نهاية الصلاحية — طابع زمني يستخدم للتتبع أو التحكم في دورة حياة العملية.';
COMMENT ON COLUMN store.coupons.usage_limit IS 'حد الاستخدام — حد الاستخدام؛ يُستخدم ضمن عمليات أكواد الخصم وشروط الصلاحية والاستخدام..';
COMMENT ON COLUMN store.coupons.used_count IS 'عدد مرات الاستخدام — عدد مرات الاستخدام؛ يُستخدم ضمن عمليات أكواد الخصم وشروط الصلاحية والاستخدام..';
COMMENT ON COLUMN store.coupons.is_active IS 'نشط — علامة لتفعيل/تعطيل السجل دون حذفه من قاعدة البيانات.';
COMMENT ON TABLE store.warehouses IS 'المخازن ومواقعها الجغرافية؛ تُستخدم في ترتيب الأقرب إلى العميل';
COMMENT ON COLUMN store.warehouses.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.warehouses.code IS 'الرمز — رمز أعمال يُستخدم في التعريف والبحث والربط.';
COMMENT ON COLUMN store.warehouses.name IS 'الاسم — الاسم؛ يُستخدم ضمن عمليات المخازن ومواقعها الجغرافية.';
COMMENT ON COLUMN store.warehouses.country_code IS 'رمز الدولة — رمز الدولة لربط السجل بدولة التشغيل والتوصيل.';
COMMENT ON COLUMN store.warehouses.governorate_id IS 'معرّف المحافظة — مرجع يربط السجل بكيان governorate ذي الصلة.';
COMMENT ON COLUMN store.warehouses.city_id IS 'معرّف المدينة — مرجع يربط السجل بكيان city ذي الصلة.';
COMMENT ON COLUMN store.warehouses.address_line IS 'عنوان المخزن — عنوان المخزن؛ يُستخدم ضمن عمليات المخازن ومواقعها الجغرافية.';
COMMENT ON COLUMN store.warehouses.latitude IS 'خط العرض — خط العرض الجغرافي لتحديد موقع العنوان أو المخزن.';
COMMENT ON COLUMN store.warehouses.longitude IS 'خط الطول — خط الطول الجغرافي لتحديد موقع العنوان أو المخزن.';
COMMENT ON COLUMN store.warehouses.priority IS 'أولوية المخزن — يُستخدم لكسر التعادل في المسافة بين المخازن؛ الرقم الأقل أولًا.';
COMMENT ON COLUMN store.warehouses.is_active IS 'نشط — علامة لتفعيل/تعطيل السجل دون حذفه من قاعدة البيانات.';
COMMENT ON COLUMN store.warehouses.created_at IS 'تاريخ الإنشاء — وقت إنشاء السجل لأغراض التدقيق والتقارير.';
COMMENT ON TABLE store.inventory IS 'الرصيد الفعلي والمحجوز لكل متغير داخل كل مخزن';
COMMENT ON COLUMN store.inventory.warehouse_id IS 'معرّف المخزن — مرجع يربط السجل بكيان warehouse ذي الصلة.';
COMMENT ON COLUMN store.inventory.variant_id IS 'معرّف متغير المنتج — مرجع يربط السجل بكيان variant ذي الصلة.';
COMMENT ON COLUMN store.inventory.on_hand IS 'الكمية الفعلية — الكمية الموجودة فعليًا بالمخزن قبل خصم الحجوزات.';
COMMENT ON COLUMN store.inventory.reserved IS 'الكمية المحجوزة — الكمية المحجوزة للطلبات ولم تُخصم بعد من الرصيد الفعلي.';
COMMENT ON COLUMN store.inventory.reorder_point IS 'حد إعادة الطلب — الحد الذي عنده يُنصح بإعادة التوريد.';
COMMENT ON COLUMN store.inventory.updated_at IS 'تاريخ التحديث — آخر وقت لتعديل السجل؛ يجب تحديثه عند التغيير بواسطة التطبيق أو trigger.';
COMMENT ON TABLE store.inventory_movements IS 'دفتر تدقيق لتغيرات المخزون الفعلي والمحجوز';
COMMENT ON COLUMN store.inventory_movements.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.inventory_movements.warehouse_id IS 'معرّف المخزن — مرجع يربط السجل بكيان warehouse ذي الصلة.';
COMMENT ON COLUMN store.inventory_movements.variant_id IS 'معرّف متغير المنتج — مرجع يربط السجل بكيان variant ذي الصلة.';
COMMENT ON COLUMN store.inventory_movements.movement_type IS 'نوع حركة المخزون — نوع حركة المخزون؛ يُستخدم ضمن عمليات دفتر تدقيق لتغيرات المخزون الفعلي والمحجوز..';
COMMENT ON COLUMN store.inventory_movements.quantity_delta IS 'تغيّر الكمية الفعلية — التغير في المخزون الفعلي: موجب للوارد وسالب للصرف، وصفر للحجز.';
COMMENT ON COLUMN store.inventory_movements.reserved_delta IS 'تغيّر الكمية المحجوزة — التغير في الكمية المحجوزة: موجب عند الحجز وسالب عند التحرير/البيع.';
COMMENT ON COLUMN store.inventory_movements.reference_type IS 'نوع المرجع — نوع المرجع؛ يُستخدم ضمن عمليات دفتر تدقيق لتغيرات المخزون الفعلي والمحجوز..';
COMMENT ON COLUMN store.inventory_movements.reference_id IS 'معرّف المرجع — مرجع يربط السجل بكيان reference ذي الصلة.';
COMMENT ON COLUMN store.inventory_movements.note IS 'ملاحظة — شرح أو سبب نصي للتشغيل وخدمة العملاء والتدقيق.';
COMMENT ON COLUMN store.inventory_movements.actor_user_id IS 'معرّف المستخدم المنفّذ — مرجع يربط السجل بكيان actor user ذي الصلة.';
COMMENT ON COLUMN store.inventory_movements.created_at IS 'تاريخ الإنشاء — وقت إنشاء السجل لأغراض التدقيق والتقارير.';
COMMENT ON TABLE store.carts IS 'سلال العملاء المسجلين والزوار قبل تحويلها لطلبات';
COMMENT ON COLUMN store.carts.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.carts.user_id IS 'معرّف المستخدم — مرجع يربط السجل بكيان user ذي الصلة.';
COMMENT ON COLUMN store.carts.guest_token_hash IS 'تجزئة رمز الزائر — قيمة مجزأة لرمز سلة الزائر؛ لا يُخزن الرمز الخام.';
COMMENT ON COLUMN store.carts.currency IS 'العملة — رمز العملة ISO 4217؛ الإعداد الافتراضي الجنيه المصري EGP.';
COMMENT ON COLUMN store.carts.expires_at IS 'تاريخ انتهاء الصلاحية — تاريخ انتهاء صلاحية السجل؛ تُعالج الانتهاءات من التطبيق/المهام المجدولة.';
COMMENT ON COLUMN store.carts.created_at IS 'تاريخ الإنشاء — وقت إنشاء السجل لأغراض التدقيق والتقارير.';
COMMENT ON COLUMN store.carts.updated_at IS 'تاريخ التحديث — آخر وقت لتعديل السجل؛ يجب تحديثه عند التغيير بواسطة التطبيق أو trigger.';
COMMENT ON TABLE store.cart_items IS 'المتغيرات والكميات المطلوبة في كل سلة';
COMMENT ON COLUMN store.cart_items.cart_id IS 'معرّف السلة — مرجع يربط السجل بكيان cart ذي الصلة.';
COMMENT ON COLUMN store.cart_items.variant_id IS 'معرّف متغير المنتج — مرجع يربط السجل بكيان variant ذي الصلة.';
COMMENT ON COLUMN store.cart_items.quantity IS 'الكمية — عدد الوحدات المرتبطة بهذا البند أو العملية.';
COMMENT ON TABLE store.orders IS 'رأس الطلب وبيانات العميل والمبالغ وعنوان الشحن المثبت لحظة الشراء';
COMMENT ON COLUMN store.orders.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.orders.order_number IS 'رقم الطلب — رقم متسلسل مقروء للبشر يستخدم في خدمة العملاء والتتبع.';
COMMENT ON COLUMN store.orders.user_id IS 'معرّف المستخدم — مرجع يربط السجل بكيان user ذي الصلة.';
COMMENT ON COLUMN store.orders.guest_email IS 'بريد الزائر — البريد المقدم أثناء الشراء كزائر، دون إنشاء حساب.';
COMMENT ON COLUMN store.orders.guest_phone IS 'هاتف الزائر — الهاتف المقدم أثناء الشراء كزائر، دون إنشاء حساب.';
COMMENT ON COLUMN store.orders.customer_name IS 'اسم العميل — اسم العميل؛ يُستخدم ضمن عمليات رأس الطلب وبيانات العميل والمبالغ وعنوان الشحن المثبت لحظة الشراء..';
COMMENT ON COLUMN store.orders.customer_email IS 'بريد العميل — عنوان بريد إلكتروني للتواصل والإشعارات.';
COMMENT ON COLUMN store.orders.customer_phone IS 'هاتف العميل — رقم هاتف للتواصل أو التحقق أو تسليم الطلب.';
COMMENT ON COLUMN store.orders.status IS 'الحالة — الحالة التشغيلية للسجل؛ تُستخدم لتحديد الإجراءات المسموحة والتقارير.';
COMMENT ON COLUMN store.orders.payment_status IS 'حالة الدفع — حالة الدفع؛ يُستخدم ضمن عمليات رأس الطلب وبيانات العميل والمبالغ وعنوان الشحن المثبت لحظة الشراء..';
COMMENT ON COLUMN store.orders.currency IS 'العملة — رمز العملة ISO 4217؛ الإعداد الافتراضي الجنيه المصري EGP.';
COMMENT ON COLUMN store.orders.subtotal IS 'المجموع الفرعي — قيمة مالية تُستخدم في التسعير أو الحساب أو التسوية وفق سياق الجدول.';
COMMENT ON COLUMN store.orders.discount_total IS 'إجمالي الخصومات — قيمة مالية تُستخدم في التسعير أو الحساب أو التسوية وفق سياق الجدول.';
COMMENT ON COLUMN store.orders.shipping_total IS 'تكلفة الشحن — قيمة مالية تُستخدم في التسعير أو الحساب أو التسوية وفق سياق الجدول.';
COMMENT ON COLUMN store.orders.tax_total IS 'إجمالي الضرائب — قيمة مالية تُستخدم في التسعير أو الحساب أو التسوية وفق سياق الجدول.';
COMMENT ON COLUMN store.orders.grand_total IS 'الإجمالي النهائي — قيمة محسوبة آليًا = subtotal − discount_total + shipping_total + tax_total.';
COMMENT ON COLUMN store.orders.coupon_id IS 'معرّف الكوبون — الكوبون الذي استُخدم في الطلب إن وجد.';
COMMENT ON COLUMN store.orders.shipping_address IS 'عنوان الشحن — نسخة JSON من عنوان الشحن عند تأكيد الطلب، حتى لو عُدّل دفتر العناوين.';
COMMENT ON COLUMN store.orders.billing_address IS 'عنوان الفوترة — نسخة JSON اختيارية من عنوان الفوترة.';
COMMENT ON COLUMN store.orders.shipping_latitude IS 'خط عرض الشحن — إحداثي العميل لحساب أقرب مخزن؛ يتطلب توفر خط الطول أيضًا.';
COMMENT ON COLUMN store.orders.shipping_longitude IS 'خط طول الشحن — إحداثي العميل لحساب أقرب مخزن؛ يتطلب توفر خط العرض أيضًا.';
COMMENT ON COLUMN store.orders.notes IS 'ملاحظات — شرح أو سبب نصي للتشغيل وخدمة العملاء والتدقيق.';
COMMENT ON COLUMN store.orders.placed_at IS 'تاريخ تقديم الطلب — طابع زمني يستخدم للتتبع أو التحكم في دورة حياة العملية.';
COMMENT ON COLUMN store.orders.updated_at IS 'تاريخ التحديث — آخر وقت لتعديل السجل؛ يجب تحديثه عند التغيير بواسطة التطبيق أو trigger.';
COMMENT ON TABLE store.order_items IS 'بنود الطلب مع نسخ ثابتة من أسماء المنتجات والأسعار';
COMMENT ON COLUMN store.order_items.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.order_items.order_id IS 'معرّف الطلب — مرجع يربط السجل بكيان order ذي الصلة.';
COMMENT ON COLUMN store.order_items.variant_id IS 'معرّف متغير المنتج — مرجع يربط السجل بكيان variant ذي الصلة.';
COMMENT ON COLUMN store.order_items.sku_snapshot IS 'نسخة رمز المخزون — نسخة SKU وقت الشراء للحفاظ على تاريخ الطلب.';
COMMENT ON COLUMN store.order_items.product_name_snapshot IS 'نسخة اسم المنتج — اسم المنتج وقت الشراء حتى لو تغير الاسم في الكتالوج.';
COMMENT ON COLUMN store.order_items.variant_snapshot IS 'نسخة بيانات المتغير — نسخة خصائص المتغير وقت الشراء.';
COMMENT ON COLUMN store.order_items.quantity IS 'الكمية — عدد الوحدات المرتبطة بهذا البند أو العملية.';
COMMENT ON COLUMN store.order_items.unit_price IS 'سعر الوحدة — سعر الوحدة وقت إنشاء بند الطلب، وليس السعر الحالي.';
COMMENT ON COLUMN store.order_items.discount_amount IS 'مبلغ الخصم — مبلغ الخصم؛ يُستخدم ضمن عمليات بنود الطلب مع نسخ ثابتة من أسماء المنتجات والأسعار..';
COMMENT ON COLUMN store.order_items.line_total IS 'إجمالي البند — إجمالي السطر محسوب من السعر والكمية والخصم حسب تعريف SQL.';
COMMENT ON TABLE store.order_status_history IS 'تتبع تغيرات حالة الطلب ومن نفذها ومتى';
COMMENT ON COLUMN store.order_status_history.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.order_status_history.order_id IS 'معرّف الطلب — مرجع يربط السجل بكيان order ذي الصلة.';
COMMENT ON COLUMN store.order_status_history.old_status IS 'الحالة السابقة — الحالة السابقة؛ يُستخدم ضمن عمليات تتبع تغيرات حالة الطلب ومن نفذها ومتى..';
COMMENT ON COLUMN store.order_status_history.new_status IS 'الحالة الجديدة — الحالة الجديدة؛ يُستخدم ضمن عمليات تتبع تغيرات حالة الطلب ومن نفذها ومتى..';
COMMENT ON COLUMN store.order_status_history.changed_by IS 'تم التغيير بواسطة — مرجع يربط السجل بكيان المستخدم ذي الصلة.';
COMMENT ON COLUMN store.order_status_history.note IS 'ملاحظة — شرح أو سبب نصي للتشغيل وخدمة العملاء والتدقيق.';
COMMENT ON COLUMN store.order_status_history.created_at IS 'تاريخ الإنشاء — وقت إنشاء السجل لأغراض التدقيق والتقارير.';
COMMENT ON TABLE store.fulfillments IS 'عملية تجهيز/شحن طلب من مخزن معين مع بيانات التتبع';
COMMENT ON COLUMN store.fulfillments.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.fulfillments.order_id IS 'معرّف الطلب — مرجع يربط السجل بكيان order ذي الصلة.';
COMMENT ON COLUMN store.fulfillments.warehouse_id IS 'معرّف المخزن — مرجع يربط السجل بكيان warehouse ذي الصلة.';
COMMENT ON COLUMN store.fulfillments.status IS 'الحالة — الحالة التشغيلية للسجل؛ تُستخدم لتحديد الإجراءات المسموحة والتقارير.';
COMMENT ON COLUMN store.fulfillments.shipping_provider IS 'شركة الشحن — شركة الشحن؛ يُستخدم ضمن عمليات عملية تجهيز/شحن طلب من مخزن معين مع بيانات التتبع..';
COMMENT ON COLUMN store.fulfillments.tracking_number IS 'رقم التتبع — رقم التتبع؛ يُستخدم ضمن عمليات عملية تجهيز/شحن طلب من مخزن معين مع بيانات التتبع..';
COMMENT ON COLUMN store.fulfillments.shipped_at IS 'تاريخ الشحن — طابع زمني يستخدم للتتبع أو التحكم في دورة حياة العملية.';
COMMENT ON COLUMN store.fulfillments.delivered_at IS 'تاريخ التسليم — طابع زمني يستخدم للتتبع أو التحكم في دورة حياة العملية.';
COMMENT ON COLUMN store.fulfillments.created_at IS 'تاريخ الإنشاء — وقت إنشاء السجل لأغراض التدقيق والتقارير.';
COMMENT ON TABLE store.fulfillment_items IS 'البنود والكميات المرتبطة بكل عملية تجهيز';
COMMENT ON COLUMN store.fulfillment_items.fulfillment_id IS 'معرّف التجهيز — مرجع يربط السجل بكيان fulfillment ذي الصلة.';
COMMENT ON COLUMN store.fulfillment_items.order_item_id IS 'معرّف بند الطلب — مرجع يربط السجل بكيان order item ذي الصلة.';
COMMENT ON COLUMN store.fulfillment_items.quantity IS 'الكمية — عدد الوحدات المرتبطة بهذا البند أو العملية.';
COMMENT ON TABLE store.inventory_reservations IS 'حجز مؤقت للمخزون أثناء إتمام الطلب والدفع';
COMMENT ON COLUMN store.inventory_reservations.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.inventory_reservations.order_id IS 'معرّف الطلب — مرجع يربط السجل بكيان order ذي الصلة.';
COMMENT ON COLUMN store.inventory_reservations.order_item_id IS 'معرّف بند الطلب — مرجع يربط السجل بكيان order item ذي الصلة.';
COMMENT ON COLUMN store.inventory_reservations.warehouse_id IS 'معرّف المخزن — مرجع يربط السجل بكيان warehouse ذي الصلة.';
COMMENT ON COLUMN store.inventory_reservations.variant_id IS 'معرّف متغير المنتج — مرجع يربط السجل بكيان variant ذي الصلة.';
COMMENT ON COLUMN store.inventory_reservations.quantity IS 'الكمية — عدد الوحدات المرتبطة بهذا البند أو العملية.';
COMMENT ON COLUMN store.inventory_reservations.status IS 'الحالة — الحالة التشغيلية للسجل؛ تُستخدم لتحديد الإجراءات المسموحة والتقارير.';
COMMENT ON COLUMN store.inventory_reservations.expires_at IS 'تاريخ انتهاء الصلاحية — تاريخ انتهاء صلاحية السجل؛ تُعالج الانتهاءات من التطبيق/المهام المجدولة.';
COMMENT ON COLUMN store.inventory_reservations.created_at IS 'تاريخ الإنشاء — وقت إنشاء السجل لأغراض التدقيق والتقارير.';
COMMENT ON COLUMN store.inventory_reservations.updated_at IS 'تاريخ التحديث — آخر وقت لتعديل السجل؛ يجب تحديثه عند التغيير بواسطة التطبيق أو trigger.';
COMMENT ON TABLE store.payments IS 'محاولات/عمليات دفع الطلب سواء إلكترونيًا أو عند الاستلام';
COMMENT ON COLUMN store.payments.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.payments.order_id IS 'معرّف الطلب — مرجع يربط السجل بكيان order ذي الصلة.';
COMMENT ON COLUMN store.payments.method IS 'طريقة الدفع — طريقة الدفع؛ يُستخدم ضمن عمليات محاولات/عمليات دفع الطلب سواء إلكترونيًا أو عند الاستلام..';
COMMENT ON COLUMN store.payments.status IS 'الحالة — الحالة التشغيلية للسجل؛ تُستخدم لتحديد الإجراءات المسموحة والتقارير.';
COMMENT ON COLUMN store.payments.provider IS 'مزود الدفع — مزود الدفع؛ يُستخدم ضمن عمليات محاولات/عمليات دفع الطلب سواء إلكترونيًا أو عند الاستلام..';
COMMENT ON COLUMN store.payments.provider_payment_id IS 'معرّف العملية لدى المزود — مرجع الدفع الخارجي لدى بوابة الدفع.';
COMMENT ON COLUMN store.payments.amount IS 'المبلغ — قيمة مالية تُستخدم في التسعير أو الحساب أو التسوية وفق سياق الجدول.';
COMMENT ON COLUMN store.payments.currency IS 'العملة — رمز العملة ISO 4217؛ الإعداد الافتراضي الجنيه المصري EGP.';
COMMENT ON COLUMN store.payments.idempotency_key IS 'مفتاح منع التكرار — مفتاح فريد يمنع تكرار تسجيل عملية الدفع عند إعادة المحاولة.';
COMMENT ON COLUMN store.payments.paid_at IS 'تاريخ الدفع — طابع زمني يستخدم للتتبع أو التحكم في دورة حياة العملية.';
COMMENT ON COLUMN store.payments.created_at IS 'تاريخ الإنشاء — وقت إنشاء السجل لأغراض التدقيق والتقارير.';
COMMENT ON TABLE store.payment_events IS 'أحداث مزود الدفع الواردة (webhooks) للتدقيق ومنع المعالجة المكررة';
COMMENT ON COLUMN store.payment_events.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.payment_events.payment_id IS 'معرّف الدفع — مرجع يربط السجل بكيان payment ذي الصلة.';
COMMENT ON COLUMN store.payment_events.provider_event_id IS 'معرّف حدث المزود — معرّف حدث لدى بوابة الدفع يستخدم لتفادي تكرار معالجة الحدث.';
COMMENT ON COLUMN store.payment_events.event_type IS 'نوع الحدث — نوع الحدث؛ يُستخدم ضمن عمليات أحداث مزود الدفع الواردة (webhooks) للتدقيق ومنع المعالجة المكررة..';
COMMENT ON COLUMN store.payment_events.payload IS 'محتوى الحدث — تفاصيل الحدث بصيغة JSON للمعالجة أو التدقيق.';
COMMENT ON COLUMN store.payment_events.received_at IS 'تاريخ الاستلام — طابع زمني يستخدم للتتبع أو التحكم في دورة حياة العملية.';
COMMENT ON TABLE store.refunds IS 'عمليات رد الأموال المرتبطة بمدفوعات سابقة';
COMMENT ON COLUMN store.refunds.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.refunds.payment_id IS 'معرّف الدفع — مرجع يربط السجل بكيان payment ذي الصلة.';
COMMENT ON COLUMN store.refunds.amount IS 'المبلغ — قيمة مالية تُستخدم في التسعير أو الحساب أو التسوية وفق سياق الجدول.';
COMMENT ON COLUMN store.refunds.reason IS 'السبب — شرح أو سبب نصي للتشغيل وخدمة العملاء والتدقيق.';
COMMENT ON COLUMN store.refunds.provider_refund_id IS 'معرّف الاسترداد لدى المزود — مرجع الاسترداد الخارجي لدى مزود الدفع.';
COMMENT ON COLUMN store.refunds.status IS 'الحالة — الحالة التشغيلية للسجل؛ تُستخدم لتحديد الإجراءات المسموحة والتقارير.';
COMMENT ON COLUMN store.refunds.created_at IS 'تاريخ الإنشاء — وقت إنشاء السجل لأغراض التدقيق والتقارير.';
COMMENT ON TABLE store.shipping_zones IS 'مناطق تغطية الشحن المرتبطة بالدولة أو المحافظة';
COMMENT ON COLUMN store.shipping_zones.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.shipping_zones.name IS 'الاسم — الاسم؛ يُستخدم ضمن عمليات مناطق تغطية الشحن المرتبطة بالدولة أو المحافظة..';
COMMENT ON COLUMN store.shipping_zones.country_code IS 'رمز الدولة — رمز الدولة لربط السجل بدولة التشغيل والتوصيل.';
COMMENT ON COLUMN store.shipping_zones.governorate_id IS 'معرّف المحافظة — مرجع يربط السجل بكيان governorate ذي الصلة.';
COMMENT ON COLUMN store.shipping_zones.is_active IS 'نشط — علامة لتفعيل/تعطيل السجل دون حذفه من قاعدة البيانات.';
COMMENT ON TABLE store.shipping_rates IS 'تعريفة الشحن حسب المنطقة وشريحة الوزن';
COMMENT ON COLUMN store.shipping_rates.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.shipping_rates.zone_id IS 'معرّف منطقة الشحن — مرجع يربط السجل بكيان zone ذي الصلة.';
COMMENT ON COLUMN store.shipping_rates.min_weight_grams IS 'الحد الأدنى للوزن بالجرام — وزن بالجرام يستخدم في حساب الشحن والتحقق من الشرائح.';
COMMENT ON COLUMN store.shipping_rates.max_weight_grams IS 'الحد الأقصى للوزن بالجرام — وزن بالجرام يستخدم في حساب الشحن والتحقق من الشرائح.';
COMMENT ON COLUMN store.shipping_rates.amount IS 'المبلغ — قيمة مالية تُستخدم في التسعير أو الحساب أو التسوية وفق سياق الجدول.';
COMMENT ON COLUMN store.shipping_rates.currency IS 'العملة — رمز العملة ISO 4217؛ الإعداد الافتراضي الجنيه المصري EGP.';
COMMENT ON TABLE store.returns IS 'طلبات إرجاع المنتجات وحالتها';
COMMENT ON COLUMN store.returns.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.returns.order_id IS 'معرّف الطلب — مرجع يربط السجل بكيان order ذي الصلة.';
COMMENT ON COLUMN store.returns.status IS 'الحالة — الحالة التشغيلية للسجل؛ تُستخدم لتحديد الإجراءات المسموحة والتقارير.';
COMMENT ON COLUMN store.returns.reason IS 'السبب — شرح أو سبب نصي للتشغيل وخدمة العملاء والتدقيق.';
COMMENT ON COLUMN store.returns.created_at IS 'تاريخ الإنشاء — وقت إنشاء السجل لأغراض التدقيق والتقارير.';
COMMENT ON TABLE store.return_items IS 'المنتجات والكميات المطلوب إرجاعها من طلب سابق';
COMMENT ON COLUMN store.return_items.return_id IS 'معرّف الإرجاع — مرجع يربط السجل بكيان return ذي الصلة.';
COMMENT ON COLUMN store.return_items.order_item_id IS 'معرّف بند الطلب — مرجع يربط السجل بكيان order item ذي الصلة.';
COMMENT ON COLUMN store.return_items.quantity IS 'الكمية — عدد الوحدات المرتبطة بهذا البند أو العملية.';
COMMENT ON TABLE store.outbox_events IS 'أحداث الأعمال التي تنتظر النشر إلى أنظمة أخرى بصورة موثوقة';
COMMENT ON COLUMN store.outbox_events.id IS 'المعرّف — معرّف فريد للسجل يُستخدم للربط والتحديث والاستعلام.';
COMMENT ON COLUMN store.outbox_events.aggregate_type IS 'نوع الكيان — نوع الكيان؛ يُستخدم ضمن عمليات أحداث الأعمال التي تنتظر النشر إلى أنظمة أخرى بصورة موثوقة..';
COMMENT ON COLUMN store.outbox_events.aggregate_id IS 'معرّف الكيان — مرجع يربط السجل بكيان aggregate ذي الصلة.';
COMMENT ON COLUMN store.outbox_events.event_type IS 'نوع الحدث — نوع الحدث؛ يُستخدم ضمن عمليات أحداث الأعمال التي تنتظر النشر إلى أنظمة أخرى بصورة موثوقة..';
COMMENT ON COLUMN store.outbox_events.payload IS 'محتوى الحدث — تفاصيل الحدث بصيغة JSON للمعالجة أو التدقيق.';
COMMENT ON COLUMN store.outbox_events.created_at IS 'تاريخ الإنشاء — وقت إنشاء السجل لأغراض التدقيق والتقارير.';
COMMENT ON COLUMN store.outbox_events.published_at IS 'تاريخ النشر — وقت إرسال الحدث بنجاح؛ NULL يعني أنه لم ينشر بعد.';
COMMENT ON COLUMN store.outbox_events.attempts IS 'عدد المحاولات — عدد المحاولات؛ يُستخدم ضمن عمليات أحداث الأعمال التي تنتظر النشر إلى أنظمة أخرى بصورة موثوقة..';
COMMENT ON FUNCTION store.distance_km(numeric, numeric, numeric, numeric) IS 'تحسب مسافة الدائرة العظمى التقريبية بالكيلومتر بين إحداثيين؛ لا تمثل مسافة الطريق.';
COMMENT ON FUNCTION store.rank_warehouses(uuid) IS 'ترتب المخازن النشطة القادرة على تغطية جميع بنود الطلب حسب المسافة ثم الأولوية ثم المعرّف.';
COMMENT ON FUNCTION store.reserve_order_at_nearest_warehouse(uuid, integer) IS 'تحجز كميات بنود الطلب في أقرب مخزن مؤهل مع قفل صفوف المخزون، وتنشئ سجل الحجز والتجهيز وحركات المخزون.';
COMMENT ON FUNCTION store.release_order_reservations(uuid) IS 'تحرر الحجوزات النشطة للطلب وتخفض الكمية المحجوزة وتسجل حركات التحرير.';
COMMENT ON FUNCTION store.consume_order_reservations(uuid) IS 'تستهلك الحجوزات النشطة للطلب وتخفض الرصيد الفعلي والمحجوز وتسجل حركات البيع.';
COMMENT ON FUNCTION store.guard_order_item_mutation() IS 'يمنع تعديل أو حذف أو نقل بند الطلب بعد وجود حجز أو عملية تجهيز مرتبطة بالطلب.';
COMMENT ON FUNCTION store.guard_fulfillment_item() IS 'يتحقق من أن بند التجهيز ينتمي إلى نفس الطلب المرتبط بعملية التجهيز.';
COMMENT ON FUNCTION store.guard_inventory_reservation() IS 'يتحقق من تطابق الطلب وبند الطلب ومتغير المنتج في سجل حجز المخزون.';
COMMENT ON EXTENSION pgcrypto IS 'يوفر دوال التشفير العشوائي المستخدمة لتوليد UUID عبر gen_random_uuid.';
COMMENT ON EXTENSION citext IS 'يوفر نوع نص غير حساس لحالة الأحرف، مستخدمًا للبريد الإلكتروني وأكواد الخصم.';
COMMENT ON EXTENSION btree_gist IS 'امتداد مثبت بواسطة ملف SQL الأصلي؛ لم يظهر استخدام مباشر له في التعريفات المرفقة.';
