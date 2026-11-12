package com.classicstore.catalog;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import static com.classicstore.catalog.CatalogDtos.*;

@Component
class CatalogMapper {
    ProductSummary toSummary(CatalogRepository.ProductRow row, List<Category> categories) {
        return new ProductSummary(row.id(), row.slug(), row.nameAr(), row.nameEn(),
            money(row.priceFrom()), "EGP", row.primaryImage(),
            row.brandName() == null ? null : new Brand(row.brandName()), categories);
    }

    ProductDetail toDetail(CatalogRepository.ProductRow row, List<Category> categories,
                           List<ProductVariant> variants, List<ProductImage> images) {
        return new ProductDetail(row.id(), row.slug(), row.nameAr(), row.nameEn(),
            row.descriptionAr(), row.descriptionEn(),
            row.brandName() == null ? null : new Brand(row.brandName()),
            categories, variants, images);
    }

    private static String money(BigDecimal value) {
        return value == null ? null : value.setScale(2, RoundingMode.UNNECESSARY).toPlainString();
    }
}