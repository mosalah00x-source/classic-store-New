package com.classicstore.catalog;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static com.classicstore.catalog.CatalogDtos.*;

@Repository
class CatalogRepository {
    private static final String PRODUCT_SELECT = """
        SELECT p.id, p.slug, p.name_ar, p.name_en, p.description_ar, p.description_en,
               price.price_from, b.id AS brand_id, b.name AS brand_name, b.slug AS brand_slug,
               image.id AS primary_image_id, image.variant_id AS primary_image_variant_id,
               image.image_url AS primary_image_url, image.alt_ar AS primary_image_alt_ar,
               image.sort_order AS primary_image_sort_order
          FROM store.products p
          LEFT JOIN store.brands b ON b.id = p.brand_id
          CROSS JOIN LATERAL (
              SELECT MIN(v.price) AS price_from
                FROM store.product_variants v
               WHERE v.product_id = p.id AND v.is_active = true
          ) price
          LEFT JOIN LATERAL (
              SELECT i.id, i.variant_id, i.image_url, i.alt_ar, i.sort_order
                FROM store.product_images i
               WHERE i.product_id = p.id
               ORDER BY i.sort_order ASC, i.id ASC
               LIMIT 1
          ) image ON true
        """;

    private static final RowMapper<ProductRow> PRODUCT_MAPPER = (rs, rowNum) -> {
        UUID imageId = rs.getObject("primary_image_id", UUID.class);
        ProductImage image = imageId == null ? null : new ProductImage(
            imageId, rs.getObject("primary_image_variant_id", UUID.class),
            rs.getString("primary_image_url"), rs.getString("primary_image_alt_ar"),
            rs.getInt("primary_image_sort_order"));
        return new ProductRow(rs.getObject("id", UUID.class), rs.getString("slug"),
            rs.getString("name_ar"), rs.getString("name_en"), rs.getString("description_ar"),
            rs.getString("description_en"), rs.getBigDecimal("price_from"),
            rs.getObject("brand_id", UUID.class), rs.getString("brand_name"), rs.getString("brand_slug"), image);
    };

    private final NamedParameterJdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    CatalogRepository(NamedParameterJdbcTemplate jdbc, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
    }

    List<ProductRow> findProducts(CatalogService.Filters filters) {
        MapSqlParameterSource params = filterParameters(filters)
            .addValue("size", filters.size()).addValue("offset", filters.offset());
        String orderBy = switch (filters.sort()) {
            case "newest" -> "p.created_at DESC, p.id ASC";
            case "priceAsc" -> "price.price_from ASC NULLS LAST, p.id ASC";
            case "priceDesc" -> "price.price_from DESC NULLS LAST, p.id ASC";
            default -> throw new IllegalArgumentException("Unsupported catalog sort");
        };
        String sql = PRODUCT_SELECT + " WHERE p.status = 'ACTIVE' " + filterClause(filters)
            + " ORDER BY " + orderBy + " LIMIT :size OFFSET :offset";
        return jdbc.query(sql, params, PRODUCT_MAPPER);
    }

    long countProducts(CatalogService.Filters filters) {
        String sql = """
            SELECT count(*)
              FROM store.products p
              CROSS JOIN LATERAL (
                  SELECT MIN(v.price) AS price_from
                    FROM store.product_variants v
                   WHERE v.product_id = p.id AND v.is_active = true
              ) price
             WHERE p.status = 'ACTIVE'
            """ + filterClause(filters);
        Long count = jdbc.queryForObject(sql, filterParameters(filters), Long.class);
        return count == null ? 0 : count;
    }

    Optional<ProductRow> findPublicProductBySlug(String slug) {
        List<ProductRow> rows = jdbc.query(PRODUCT_SELECT
            + " WHERE p.status = 'ACTIVE' AND p.slug = :slug LIMIT 1",
            Map.of("slug", slug), PRODUCT_MAPPER);
        return rows.stream().findFirst();
    }

    List<Brand> findActiveBrands() {
        return jdbc.query("""
            SELECT id, name, slug
              FROM store.brands
             WHERE is_active = true
             ORDER BY name ASC, id ASC
            """, (rs, n) -> new Brand(rs.getObject("id", UUID.class),
                rs.getString("name"), rs.getString("slug")));
    }

    List<Category> findActiveCategories() {
        return jdbc.query("""
            SELECT id, parent_id, name_ar, name_en, slug, sort_order
              FROM store.categories
             WHERE is_active = true
             ORDER BY sort_order ASC, id ASC
            """, (rs, n) -> category(rs.getObject("id", UUID.class),
                rs.getObject("parent_id", UUID.class), rs.getString("name_ar"),
                rs.getString("name_en"), rs.getString("slug"), rs.getInt("sort_order")));
    }

    Map<UUID, List<Category>> findActiveCategoriesForProducts(List<UUID> productIds) {
        if (productIds.isEmpty()) return Map.of();
        Map<UUID, List<Category>> result = new LinkedHashMap<>();
        jdbc.query("""
            SELECT pc.product_id, c.id, c.parent_id, c.name_ar, c.name_en, c.slug, c.sort_order
              FROM store.product_categories pc
              JOIN store.categories c ON c.id = pc.category_id AND c.is_active = true
             WHERE pc.product_id IN (:productIds)
             ORDER BY pc.product_id, c.sort_order ASC, c.id ASC
            """, new MapSqlParameterSource("productIds", productIds), rs -> {
                UUID productId = rs.getObject("product_id", UUID.class);
                result.computeIfAbsent(productId, ignored -> new ArrayList<>()).add(category(
                    rs.getObject("id", UUID.class), rs.getObject("parent_id", UUID.class),
                    rs.getString("name_ar"), rs.getString("name_en"), rs.getString("slug"),
                    rs.getInt("sort_order")));
            });
        return result;
    }

    List<ProductVariant> findActiveVariants(UUID productId) {
        return jdbc.query("""
            SELECT id, sku, title_ar, attributes::text AS attributes_json, price
              FROM store.product_variants
             WHERE product_id = :productId AND is_active = true
            """, Map.of("productId", productId), (rs, n) -> {
                Map<String, Object> attributes;
                try {
                    attributes = objectMapper.readValue(rs.getString("attributes_json"),
                        new TypeReference<Map<String, Object>>() {});
                } catch (IOException ex) {
                    throw new IllegalStateException("Could not read product variant attributes", ex);
                }
                return new ProductVariant(rs.getObject("id", UUID.class), rs.getString("sku"),
                    rs.getString("title_ar"), attributes, money(rs.getBigDecimal("price")), "EGP");
            });
    }

    List<ProductImage> findImages(UUID productId) {
        return jdbc.query("""
            SELECT id, variant_id, image_url, alt_ar, sort_order
              FROM store.product_images
             WHERE product_id = :productId
             ORDER BY sort_order ASC, id ASC
            """, Map.of("productId", productId), (rs, n) -> new ProductImage(
                rs.getObject("id", UUID.class), rs.getObject("variant_id", UUID.class),
                rs.getString("image_url"), rs.getString("alt_ar"), rs.getInt("sort_order")));
    }

    private static String filterClause(CatalogService.Filters f) {
        StringBuilder sql = new StringBuilder();
        if (f.qPattern() != null) {
            sql.append("""
                AND (p.name_ar ILIKE :qPattern ESCAPE '\\'
                     OR COALESCE(p.name_en, '') ILIKE :qPattern ESCAPE '\\'
                     OR EXISTS (SELECT 1 FROM store.product_variants qv
                         WHERE qv.product_id = p.id AND qv.is_active = true
                           AND qv.sku ILIKE :qPattern ESCAPE '\\'))
                """);
        }
        if (f.categoryId() != null) {
            sql.append("""
                AND EXISTS (SELECT 1 FROM store.product_categories pc
                    JOIN store.categories fc ON fc.id = pc.category_id AND fc.is_active = true
                    WHERE pc.product_id = p.id AND pc.category_id = :categoryId)
                """);
        }
        if (f.brandId() != null) sql.append(" AND p.brand_id = :brandId ");
        if (f.minPrice() != null) sql.append(" AND price.price_from >= :minPrice ");
        if (f.maxPrice() != null) sql.append(" AND price.price_from <= :maxPrice ");
        return sql.toString();
    }

    private static MapSqlParameterSource filterParameters(CatalogService.Filters f) {
        MapSqlParameterSource params = new MapSqlParameterSource();
        if (f.qPattern() != null) params.addValue("qPattern", f.qPattern());
        if (f.categoryId() != null) params.addValue("categoryId", f.categoryId());
        if (f.brandId() != null) params.addValue("brandId", f.brandId());
        if (f.minPrice() != null) params.addValue("minPrice", f.minPrice());
        if (f.maxPrice() != null) params.addValue("maxPrice", f.maxPrice());
        return params;
    }

    private static Category category(UUID id, UUID parentId, String nameAr, String nameEn,
                                     String slug, int sortOrder) {
        return new Category(id, parentId, nameAr, nameEn, slug, sortOrder);
    }

    private static String money(BigDecimal value) {
        return value.setScale(2, java.math.RoundingMode.UNNECESSARY).toPlainString();
    }

    record ProductRow(UUID id, String slug, String nameAr, String nameEn, String descriptionAr,
                      String descriptionEn, BigDecimal priceFrom, UUID brandId, String brandName,
                      String brandSlug, ProductImage primaryImage) {}
}