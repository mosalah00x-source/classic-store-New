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

COMMENT ON FUNCTION store.guard_order_item_mutation() IS 'يمنع تعديل أو حذف أو نقل بند الطلب بعد وجود حجز أو عملية تجهيز مرتبطة بالطلب.';
COMMENT ON FUNCTION store.guard_fulfillment_item() IS 'يتحقق من أن بند التجهيز ينتمي إلى نفس الطلب المرتبط بعملية التجهيز.';
COMMENT ON FUNCTION store.guard_inventory_reservation() IS 'يتحقق من تطابق الطلب وبند الطلب ومتغير المنتج في سجل حجز المخزون.';
