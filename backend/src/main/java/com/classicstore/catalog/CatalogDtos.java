package com.classicstore.catalog;
import java.util.List;
import java.util.Map;
import java.util.UUID;
final class CatalogDtos {
    private CatalogDtos() {}
    record Brand(String name) {}
    record ProductImage(UUID id, UUID variantId, String imageUrl, String altAr, int sortOrder) {}
    record Category(UUID id, UUID parentId, String nameAr, String nameEn, String slug, int sortOrder) {}
    record ProductVariant(UUID id, String sku, String titleAr, Map<String, Object> attributes, String price, String currency) {}
    record ProductSummary(UUID id, String slug, String nameAr, String nameEn, String priceFrom, String currency, ProductImage primaryImage, Brand brand, List<Category> categories) {}
    record ProductDetail(UUID id, String slug, String nameAr, String nameEn, String descriptionAr, String descriptionEn, Brand brand, List<Category> categories, List<ProductVariant> variants, List<ProductImage> images) {}
    record ProductPage(int page, int size, long totalElements, int totalPages, List<ProductSummary> content) {}
}