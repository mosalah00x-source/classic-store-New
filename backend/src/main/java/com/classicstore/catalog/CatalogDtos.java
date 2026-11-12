package com.classicstore.catalog;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public final class CatalogDtos {
    private CatalogDtos() {}
    public record Brand(String name) {}
    public record ProductImage(UUID id, UUID variantId, String imageUrl, String altAr, int sortOrder) {}
    public record Category(UUID id, UUID parentId, String nameAr, String nameEn, String slug, int sortOrder) {}
    public record ProductVariant(UUID id, String sku, String titleAr, Map<String, Object> attributes, String price, String currency) {}
    public record ProductSummary(UUID id, String slug, String nameAr, String nameEn, String priceFrom, String currency, ProductImage primaryImage, Brand brand, List<Category> categories) {}
    public record ProductDetail(UUID id, String slug, String nameAr, String nameEn, String descriptionAr, String descriptionEn, Brand brand, List<Category> categories, List<ProductVariant> variants, List<ProductImage> images) {}
    public record ProductPage(int page, int size, long totalElements, int totalPages, List<ProductSummary> content) {}
}