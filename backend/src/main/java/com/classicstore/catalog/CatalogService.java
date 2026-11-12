package com.classicstore.catalog;
import com.classicstore.common.error.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import static com.classicstore.catalog.CatalogDtos.*;

@Service
class CatalogService {
    private static final int DEFAULT_PAGE = 0, DEFAULT_SIZE = 20, MAX_SIZE = 100;
    private final CatalogRepository repository;
    CatalogService(CatalogRepository repository) { this.repository = repository; }

    @Transactional(readOnly = true)
    ProductPage listProducts(String q, String categoryId, String brandId, String minPrice,
                             String maxPrice, String sort, String page, String size) {
        Filters filters = filters(q, categoryId, brandId, minPrice, maxPrice, sort, page, size);
        List<CatalogRepository.ProductRow> rows = repository.findProducts(filters);
        long total = repository.countProducts(filters);
        Map<UUID, List<Category>> categories = repository.findActiveCategoriesForProducts(
            rows.stream().map(CatalogRepository.ProductRow::id).toList());
        List<ProductSummary> content = rows.stream().map(row -> new ProductSummary(
            row.id(), row.slug(), row.nameAr(), row.nameEn(), money(row.priceFrom()), "EGP",
            row.primaryImage(), row.brandName() == null ? null : new Brand(row.brandName()),
            categories.getOrDefault(row.id(), List.of()))).toList();
        int totalPages = total == 0 ? 0 : (int) ((total + filters.size() - 1) / filters.size());
        return new ProductPage(filters.page(), filters.size(), total, totalPages, content);
    }

    @Transactional(readOnly = true)
    ProductDetail getProduct(String slug) {
        CatalogRepository.ProductRow row = repository.findPublicProductBySlug(slug).orElseThrow(CatalogService::notFound);
        List<Category> categories = repository.findActiveCategoriesForProducts(List.of(row.id())).getOrDefault(row.id(), List.of());
        return new ProductDetail(row.id(), row.slug(), row.nameAr(), row.nameEn(), row.descriptionAr(),
            row.descriptionEn(), row.brandName() == null ? null : new Brand(row.brandName()), categories,
            repository.findActiveVariants(row.id()), repository.findImages(row.id()));
    }

    @Transactional(readOnly = true)
    List<Category> getCategories() { return repository.findActiveCategories(); }

    private static Filters filters(String q, String categoryId, String brandId, String minPrice,
                                   String maxPrice, String sort, String page, String size) {
        String pattern = null;
        if (q != null) {
            String value = q.trim();
            if (value.isEmpty()) throw validation("q");
            pattern = "%" + value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%";
        }
        UUID category = uuid(categoryId, "categoryId"), brand = uuid(brandId, "brandId");
        BigDecimal minimum = price(minPrice, "minPrice"), maximum = price(maxPrice, "maxPrice");
        if (minimum != null && maximum != null && minimum.compareTo(maximum) > 0) throw validation("minPrice");
        String selectedSort = sort == null ? "newest" : sort;
        if (!List.of("newest", "priceAsc", "priceDesc").contains(selectedSort)) throw validation("sort");
        int selectedPage = integer(page, DEFAULT_PAGE, "page"), selectedSize = integer(size, DEFAULT_SIZE, "size");
        if (selectedPage < 0) throw validation("page");
        if (selectedSize < 1 || selectedSize > MAX_SIZE) throw validation("size");
        long offset = (long) selectedPage * selectedSize;
        if (offset > Integer.MAX_VALUE) throw validation("page");
        return new Filters(pattern, category, brand, minimum, maximum, selectedSort,
            selectedPage, selectedSize, (int) offset);
    }
    private static UUID uuid(String value, String field) {
        if (value == null) return null;
        try { return UUID.fromString(value); } catch (IllegalArgumentException ex) { throw validation(field); }
    }
    private static BigDecimal price(String value, String field) {
        if (value == null) return null;
        if (!value.matches("[0-9]+\\.[0-9]{2}")) throw validation(field);
        try { return new BigDecimal(value); } catch (NumberFormatException ex) { throw validation(field); }
    }
    private static int integer(String value, int defaultValue, String field) {
        if (value == null) return defaultValue;
        try { return Integer.parseInt(value); } catch (NumberFormatException ex) { throw validation(field); }
    }
    private static String money(BigDecimal value) {
        return value == null ? null : value.setScale(2, java.math.RoundingMode.UNNECESSARY).toPlainString();
    }
    private static BusinessException validation(String field) {
        return new BusinessException("VALIDATION_ERROR", "البيانات المدخلة غير صحيحة",
            "Invalid input data", HttpStatus.BAD_REQUEST, Map.of("field", field));
    }
    private static BusinessException notFound() {
        return new BusinessException("NOT_FOUND", "المنتج غير موجود أو غير منشور",
            "Product not found or not publicly published", HttpStatus.NOT_FOUND, Map.of());
    }
    record Filters(String qPattern, UUID categoryId, UUID brandId, BigDecimal minPrice,
                   BigDecimal maxPrice, String sort, int page, int size, int offset) {}
}