package com.classicstore.catalog;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CatalogIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;
    @Autowired ObjectMapper json;

    @Test
    void publicListAndDetailExposeOnlyActiveProducts() throws Exception {
        UUID active = product("منتج منشور", "Published product", "published-" + UUID.randomUUID(), "ACTIVE", null, Instant.now());
        product("مسودة", "Draft", "draft-" + UUID.randomUUID(), "DRAFT", null, Instant.now());
        product("مؤرشف", "Archived", "archived-" + UUID.randomUUID(), "ARCHIVED", null, Instant.now());
        String slug = jdbc.queryForObject("select slug from store.products where id=?", String.class, active);

        mvc.perform(get("/api/v1/products").param("size", "100"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[?(@.id == '" + active + "')]").isArray())
            .andExpect(jsonPath("$.content[?(@.slug == '" + slug + "')]").isArray());

        mvc.perform(get("/api/v1/products/" + slug))
            .andExpect(status().isOk()).andExpect(jsonPath("$.id").value(active.toString()));
        String draftSlug = "draft-missing-" + UUID.randomUUID();
        UUID draft = product("مسودة أخرى", "Another draft", draftSlug, "DRAFT", null, Instant.now());
        mvc.perform(get("/api/v1/products/" + draftSlug))
            .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("NOT_FOUND"))
            .andExpect(jsonPath("$.messageEn").isNotEmpty()).andExpect(jsonPath("$.details").isMap());
        assertThat(draft).isNotNull();
    }

    @Test
    void activeVariantsAloneDeterminePriceAndDetail() throws Exception {
        UUID withVariants = product("حذاء", "Shoe", "shoe-" + UUID.randomUUID(), "ACTIVE", null, Instant.now());
        variant(withVariants, "SHOE-ACTIVE-" + UUID.randomUUID(), "950.00", true, "{}");
        variant(withVariants, "SHOE-INACTIVE-" + UUID.randomUUID(), "10.00", false, "{\"size\":\"old\"}");

        UUID noActiveVariant = product("منتج بلا متغير نشط", "No active variant", "no-variant-" + UUID.randomUUID(), "ACTIVE", null, Instant.now());
        variant(noActiveVariant, "INACTIVE-" + UUID.randomUUID(), "25.00", false, "{}");
        String slug = jdbc.queryForObject("select slug from store.products where id=?", String.class, withVariants);
        String noVariantSlug = jdbc.queryForObject("select slug from store.products where id=?", String.class, noActiveVariant);

        mvc.perform(get("/api/v1/products/" + slug))
            .andExpect(status().isOk()).andExpect(jsonPath("$.variants.length()").value(1))
            .andExpect(jsonPath("$.variants[0].price").value("950.00"))
            .andExpect(jsonPath("$.variants[0].currency").value("EGP"))
            .andExpect(jsonPath("$.variants[0].sku").value(org.hamcrest.Matchers.startsWith("SHOE-ACTIVE-")));

        mvc.perform(get("/api/v1/products").param("q", "Shoe"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].priceFrom").value("950.00"));
        mvc.perform(get("/api/v1/products/" + noVariantSlug))
            .andExpect(status().isOk()).andExpect(jsonPath("$.variants").isEmpty());
        mvc.perform(get("/api/v1/products").param("q", "No active variant"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].priceFrom").value(org.hamcrest.Matchers.nullValue()));
    }

    @Test
    void filtersWorkIndividuallyAndTogether() throws Exception {
        UUID categoryA = category("category-a-" + UUID.randomUUID(), true);
        UUID categoryB = category("category-b-" + UUID.randomUUID(), true);
        UUID brandA = brand("Brand A " + UUID.randomUUID());
        UUID brandB = brand("Brand B " + UUID.randomUUID());
        String marker = "filter-marker-" + UUID.randomUUID();
        UUID target = product("قميص مميز", "Needle shirt " + marker, "needle-" + UUID.randomUUID(), "ACTIVE", brandA, Instant.now());
        variant(target, "NEEDLE-SKU-" + marker, "125.00", true, "{}");
        associate(target, categoryA);
        associate(target, categoryB);
        UUID other = product("قميص آخر", "Other shirt " + marker, "other-" + UUID.randomUUID(), "ACTIVE", brandB, Instant.now());
        variant(other, "OTHER-SKU-" + marker, "250.00", true, "{}");
        associate(other, categoryA);
        UUID third = product("منتج ثالث", "Third item " + marker, "third-" + UUID.randomUUID(), "ACTIVE", brandA, Instant.now());
        variant(third, "THIRD-SKU-" + marker, "75.00", true, "{}");
        associate(third, categoryB);

        assertOnlyTarget(get("/api/v1/products").param("q", "needle"), target);
        assertContainsOnly(get("/api/v1/products").param("categoryId", categoryA.toString()), target, other);
        assertContainsOnly(get("/api/v1/products").param("brandId", brandA.toString()), target, third);
        assertContainsOnly(get("/api/v1/products").param("q", marker).param("minPrice", "100.00"), target, other);
        assertContainsOnly(get("/api/v1/products").param("q", marker).param("maxPrice", "150.00"), target, third);
        assertOnlyTarget(get("/api/v1/products").param("categoryId", categoryA.toString())
            .param("brandId", brandA.toString()).param("minPrice", "100.00")
            .param("maxPrice", "150.00").param("q", "needle"), target);
    }

    @Test
    void qIsCaseInsensitiveSubstringAndEscapesSqlWildcards() throws Exception {
        UUID matching = product("قماش مميز", "Cotton special", "cotton-" + UUID.randomUUID(), "ACTIVE", null, Instant.now());
        variant(matching, "SKU_50%_X_" + UUID.randomUUID(), "20.00", true, "{}");
        UUID decoy = product("قطن آخر", "Other cotton", "decoy-" + UUID.randomUUID(), "ACTIVE", null, Instant.now());
        variant(decoy, "SKU_50AA_X_" + UUID.randomUUID(), "21.00", true, "{}");

        mvc.perform(get("/api/v1/products").param("q", "50%_"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.content.length()").value(1))
            .andExpect(jsonPath("$.content[0].id").value(matching.toString()));
        mvc.perform(get("/api/v1/products").param("q", "COTTON S"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].id").value(matching.toString()));
        mvc.perform(get("/api/v1/products").param("q", "مميز"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].id").value(matching.toString()));
        variant(decoy, "HIDDEN-SEARCH-" + UUID.randomUUID(), "22.00", false, "{}");
        mvc.perform(get("/api/v1/products").param("q", "HIDDEN-SEARCH"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.content").isEmpty());
    }

    @Test
    void sortModesAndZeroBasedPaginationAreApplied() throws Exception {
        String marker = "sort-marker-" + UUID.randomUUID();
        UUID oldest = product("أقدم", marker + " Oldest", "old-" + UUID.randomUUID(), "ACTIVE", null, Instant.parse("2099-01-01T00:00:00Z"));
        UUID middle = product("أوسط", marker + " Middle", "middle-" + UUID.randomUUID(), "ACTIVE", null, Instant.parse("2099-02-01T00:00:00Z"));
        UUID newest = product("أحدث", marker + " Newest", "new-" + UUID.randomUUID(), "ACTIVE", null, Instant.parse("2099-03-01T00:00:00Z"));
        variant(oldest, "OLD-" + marker, "100.00", true, "{}");
        variant(middle, "MID-" + marker, "300.00", true, "{}");
        variant(newest, "NEW-" + marker, "200.00", true, "{}");
        String oldSlug = slug(oldest), middleSlug = slug(middle), newSlug = slug(newest);

        mvc.perform(get("/api/v1/products").param("q", marker).param("sort", "priceAsc"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].slug").value(oldSlug))
            .andExpect(jsonPath("$.content[1].slug").value(newSlug)).andExpect(jsonPath("$.content[2].slug").value(middleSlug));
        mvc.perform(get("/api/v1/products").param("q", marker).param("sort", "priceDesc"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].slug").value(middleSlug));
        mvc.perform(get("/api/v1/products").param("q", marker).param("sort", "newest"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].slug").value(newSlug));
        mvc.perform(get("/api/v1/products").param("q", marker).param("page", "1").param("size", "1").param("sort", "priceAsc"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.page").value(1))
            .andExpect(jsonPath("$.size").value(1)).andExpect(jsonPath("$.totalElements").value(3))
            .andExpect(jsonPath("$.totalPages").value(3))
            .andExpect(jsonPath("$.content.length()").value(1));
    }

    @Test
    void categoriesArraysAndPrimaryImageTieBreakMatchContract() throws Exception {
        UUID activeA = category("active-a-" + UUID.randomUUID(), true);
        UUID activeB = category("active-b-" + UUID.randomUUID(), true);
        UUID inactive = category("inactive-" + UUID.randomUUID(), false);
        UUID product = product("منتج صور", "Image product", "image-" + UUID.randomUUID(), "ACTIVE", null, Instant.now());
        variant(product, "IMAGE-" + UUID.randomUUID(), "99.00", true, "{}");
        associate(product, activeA); associate(product, activeB); associate(product, inactive);
        UUID lowImageId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        UUID highImageId = UUID.fromString("00000000-0000-0000-0000-000000000002");
        image(product, highImageId, null, "https://cdn.example.test/high.jpg", 1);
        image(product, lowImageId, null, "https://cdn.example.test/low.jpg", 1);
        String slug = slug(product);

        mvc.perform(get("/api/v1/products").param("q", "Image product"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.content[0].categories.length()").value(2))
            .andExpect(jsonPath("$.content[0].primaryImage.id").value(lowImageId.toString()))
            .andExpect(jsonPath("$.content[0].primaryImage.imageUrl").value("https://cdn.example.test/low.jpg"));
        mvc.perform(get("/api/v1/products/" + slug))
            .andExpect(status().isOk()).andExpect(jsonPath("$.categories.length()").value(2))
            .andExpect(jsonPath("$.images.length()").value(2))
            .andExpect(jsonPath("$.images[0].id").value(lowImageId.toString()));
        mvc.perform(get("/api/v1/categories"))
            .andExpect(status().isOk()).andExpect(jsonPath("$[?(@.id == '" + inactive + "')]").isEmpty())
            .andExpect(jsonPath("$[?(@.id == '" + activeA + "')]").isArray());
    }

    @Test
    void invalidFiltersAndUnknownSlugReturnStandardErrorShapes() throws Exception {
        mvc.perform(get("/api/v1/products").param("size", "101"))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
            .andExpect(jsonPath("$.details.field").value("size"));
        mvc.perform(get("/api/v1/products").param("page", "-1"))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
        mvc.perform(get("/api/v1/products").param("minPrice", "200.00").param("maxPrice", "100.00"))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
        mvc.perform(get("/api/v1/products").param("minPrice", "-1.00"))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
        mvc.perform(get("/api/v1/products").param("categoryId", "not-a-uuid"))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
        mvc.perform(get("/api/v1/products").param("sort", "random"))
            .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
        mvc.perform(get("/api/v1/products/not-found-" + UUID.randomUUID()))
            .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("NOT_FOUND"))
            .andExpect(jsonPath("$.messageAr").isNotEmpty()).andExpect(jsonPath("$.messageEn").isNotEmpty())
            .andExpect(jsonPath("$.traceId").isNotEmpty()).andExpect(jsonPath("$.details").isMap());
    }

    @Test
    void responsePropertiesUseOpenApiNames() throws Exception {
        UUID id = product("اسم", "Name", "contract-" + UUID.randomUUID(), "ACTIVE", null, Instant.now());
        variant(id, "CONTRACT-" + UUID.randomUUID(), "950.00", true, "{\"color\":\"red\"}");
        String slug = slug(id);
        String listBody = mvc.perform(get("/api/v1/products").param("q", "contract-"))
            .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        JsonNode page = json.readTree(listBody);
        JsonNode summary = page.get("content").get(0);
        assertThat(fieldNames(summary)).containsExactlyInAnyOrder("id", "slug", "nameAr", "nameEn",
            "priceFrom", "currency", "primaryImage", "brand", "categories");
        assertThat(summary.get("priceFrom").asText()).isEqualTo("950.00");
        assertThat(page.has("totalElements")).isTrue();
        assertThat(page.has("totalPages")).isTrue();

        String detailBody = mvc.perform(get("/api/v1/products/" + slug))
            .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        JsonNode detail = json.readTree(detailBody);
        assertThat(fieldNames(detail)).containsExactlyInAnyOrder("id", "slug", "nameAr", "nameEn",
            "descriptionAr", "descriptionEn", "brand", "categories", "variants", "images");
        assertThat(fieldNames(detail.get("variants").get(0))).containsExactlyInAnyOrder(
            "id", "sku", "titleAr", "attributes", "price", "currency");
    }

    @Test
    void newestUsesIdAscendingForCreatedAtTiesAcrossRepeatedCalls() throws Exception {
        String marker = "newest-tie-" + UUID.randomUUID();
        Instant createdAt = Instant.parse("2026-10-01T12:00:00Z");
        for (int i = 0; i < 4; i++) {
            UUID id = product("ترتيب أحدث", marker + " product " + i,
                "newest-tie-" + UUID.randomUUID(), "ACTIVE", null, createdAt);
            variant(id, "NEWEST-TIE-" + UUID.randomUUID(), "40.00", true, "{}");
        }

        List<String> expected = expectedIds(marker, "p.created_at DESC, p.id ASC");
        List<String> firstCall = listIds(marker, "newest", 0, 20);
        assertThat(firstCall).containsExactlyElementsOf(expected);
        for (int attempt = 0; attempt < 3; attempt++) {
            assertThat(listIds(marker, "newest", 0, 20)).containsExactlyElementsOf(firstCall);
        }
    }

    @Test
    void equalPricesUseIdAscendingForBothPriceSortModes() throws Exception {
        String marker = "price-tie-" + UUID.randomUUID();
        for (int i = 0; i < 4; i++) {
            UUID id = product("تعادل سعر", marker + " product " + i,
                "price-tie-" + UUID.randomUUID(), "ACTIVE", null,
                Instant.parse("2026-10-02T12:00:00Z").plusSeconds(i));
            variant(id, "PRICE-TIE-" + UUID.randomUUID(), "75.00", true, "{}");
        }

        List<String> expectedAsc = expectedIds(marker, "price.price_from ASC NULLS LAST, p.id ASC");
        List<String> expectedDesc = expectedIds(marker, "price.price_from DESC NULLS LAST, p.id ASC");
        assertThat(listIds(marker, "priceAsc", 0, 20)).containsExactlyElementsOf(expectedAsc);
        assertThat(listIds(marker, "priceDesc", 0, 20)).containsExactlyElementsOf(expectedDesc);
        assertThat(expectedAsc).containsExactlyElementsOf(expectedDesc);
    }

    @Test
    void walkingAllPagesReturnsEveryProductExactlyOnceForEachSortMode() throws Exception {
        String marker = "page-walk-" + UUID.randomUUID();
        Instant baseTime = Instant.parse("2026-10-03T12:00:00Z");
        String[] prices = {"50.00", "20.00", "50.00", null, "20.00"};
        for (int i = 0; i < prices.length; i++) {
            UUID id = product("ترقيم صفحات", marker + " product " + i,
                "page-walk-" + UUID.randomUUID(), "ACTIVE", null, baseTime.plusSeconds(i % 2));
            if (prices[i] != null) {
                variant(id, "PAGE-WALK-" + UUID.randomUUID(), prices[i], true, "{}");
            }
        }

        for (String sort : List.of("newest", "priceAsc", "priceDesc")) {
            String orderBy = switch (sort) {
                case "newest" -> "p.created_at DESC, p.id ASC";
                case "priceAsc" -> "price.price_from ASC NULLS LAST, p.id ASC";
                case "priceDesc" -> "price.price_from DESC NULLS LAST, p.id ASC";
                default -> throw new IllegalArgumentException("Unexpected test sort");
            };
            List<String> expected = expectedIds(marker, orderBy);
            List<String> walked = new ArrayList<>();
            for (int page = 0; page < 3; page++) {
                walked.addAll(listIds(marker, sort, page, 2));
            }
            assertThat(walked).hasSize(5);
            assertThat(new java.util.HashSet<>(walked)).hasSize(5);
            assertThat(walked).containsExactlyElementsOf(expected);
        }
    }

    @Test
    void productsWithoutActiveVariantPriceAreLastInBothPriceSortModes() throws Exception {
        String marker = "null-price-" + UUID.randomUUID();
        UUID low = product("سعر منخفض", marker + " low", "null-price-" + UUID.randomUUID(),
            "ACTIVE", null, Instant.parse("2026-10-04T12:00:00Z"));
        UUID high = product("سعر مرتفع", marker + " high", "null-price-" + UUID.randomUUID(),
            "ACTIVE", null, Instant.parse("2026-10-04T12:00:00Z"));
        UUID nullA = product("بلا سعر أ", marker + " null a", "null-price-" + UUID.randomUUID(),
            "ACTIVE", null, Instant.parse("2026-10-04T12:00:00Z"));
        UUID nullB = product("بلا سعر ب", marker + " null b", "null-price-" + UUID.randomUUID(),
            "ACTIVE", null, Instant.parse("2026-10-04T12:00:00Z"));
        variant(low, "NULL-PRICE-LOW-" + UUID.randomUUID(), "10.00", true, "{}");
        variant(high, "NULL-PRICE-HIGH-" + UUID.randomUUID(), "90.00", true, "{}");

        List<String> nullIds = List.of(nullA.toString(), nullB.toString()).stream().sorted().toList();
        for (String sort : List.of("priceAsc", "priceDesc")) {
            List<String> actual = listIds(marker, sort, 0, 20);
            assertThat(actual).hasSize(4);
            assertThat(actual.subList(2, 4)).containsExactlyElementsOf(nullIds);
        }
    }

    private List<String> listIds(String marker, String sort, int page, int size) throws Exception {
        String body = mvc.perform(get("/api/v1/products").param("q", marker)
                .param("sort", sort).param("page", Integer.toString(page))
                .param("size", Integer.toString(size)))
            .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        List<String> ids = new ArrayList<>();
        json.readTree(body).get("content").forEach(node -> ids.add(node.get("id").asText()));
        return ids;
    }

    private List<String> expectedIds(String marker, String orderBy) {
        String sql = """
            SELECT p.id::text
              FROM store.products p
              CROSS JOIN LATERAL (
                  SELECT MIN(v.price) AS price_from
                    FROM store.product_variants v
                   WHERE v.product_id = p.id AND v.is_active = true
              ) price
             WHERE p.status = 'ACTIVE' AND p.name_en ILIKE ?
             ORDER BY
            """ + orderBy;
        return jdbc.queryForList(sql, String.class, "%" + marker + "%");
    }

    private void assertOnlyTarget(org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder request, UUID expected) throws Exception {
        String body = mvc.perform(request).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        JsonNode content = json.readTree(body).get("content");
        assertThat(content.size()).isEqualTo(1);
        assertThat(content.get(0).get("id").asText()).isEqualTo(expected.toString());
    }

    private void assertContainsOnly(org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder request,
                                    UUID... expected) throws Exception {
        String body = mvc.perform(request).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        List<String> actual = new ArrayList<>();
        json.readTree(body).get("content").forEach(node -> actual.add(node.get("id").asText()));
        assertThat(actual).containsExactlyInAnyOrder(java.util.Arrays.stream(expected).map(UUID::toString).toArray(String[]::new));
    }

    private Set<String> fieldNames(JsonNode node) {
        Set<String> names = new java.util.HashSet<>();
        node.fieldNames().forEachRemaining(names::add);
        return names;
    }

    private UUID category(String slug, boolean active) {
        return jdbc.queryForObject("""
            INSERT INTO store.categories(name_ar,name_en,slug,is_active)
            VALUES ('تصنيف','Category',?,?) RETURNING id
            """, UUID.class, slug, active);
    }

    private UUID brand(String name) {
        return jdbc.queryForObject("INSERT INTO store.brands(name,slug) VALUES (?,?) RETURNING id",
            UUID.class, name, "brand-" + UUID.randomUUID());
    }

    private UUID product(String nameAr, String nameEn, String slug, String status, UUID brandId, Instant createdAt) {
        return jdbc.queryForObject("""
            INSERT INTO store.products(brand_id,name_ar,name_en,slug,status,created_at)
            VALUES (?,?,?,?,?::store.product_status,?) RETURNING id
            """, UUID.class, brandId, nameAr, nameEn, slug, status, java.sql.Timestamp.from(createdAt));
    }

    private UUID variant(UUID productId, String sku, String price, boolean active, String attributes) {
        return jdbc.queryForObject("""
            INSERT INTO store.product_variants(product_id,sku,price,is_active,attributes)
            VALUES (?,?,?, ?, ?::jsonb) RETURNING id
            """, UUID.class, productId, sku, new BigDecimal(price), active, attributes);
    }

    private void associate(UUID productId, UUID categoryId) {
        jdbc.update("INSERT INTO store.product_categories(product_id,category_id) VALUES (?,?)", productId, categoryId);
    }

    private void image(UUID productId, UUID imageId, UUID variantId, String url, int sortOrder) {
        jdbc.update("""
            INSERT INTO store.product_images(id,product_id,variant_id,image_url,alt_ar,sort_order)
            VALUES (?,?,?,?,?,?)
            """, imageId, productId, variantId, url, "صورة", sortOrder);
    }

    private String slug(UUID productId) {
        return jdbc.queryForObject("SELECT slug FROM store.products WHERE id=?", String.class, productId);
    }
}
