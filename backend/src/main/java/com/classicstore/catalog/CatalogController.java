package com.classicstore.catalog;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import static com.classicstore.catalog.CatalogDtos.*;

@RestController
@RequestMapping("/api/v1")
class CatalogController {
    private final CatalogService service;
    CatalogController(CatalogService service) { this.service = service; }

    @GetMapping("/products")
    ProductPage products(@RequestParam(required = false) String q,
        @RequestParam(required = false) String categoryId, @RequestParam(required = false) String brandId,
        @RequestParam(required = false) String minPrice, @RequestParam(required = false) String maxPrice,
        @RequestParam(required = false) String sort, @RequestParam(required = false) String page,
        @RequestParam(required = false) String size) {
        return service.listProducts(q, categoryId, brandId, minPrice, maxPrice, sort, page, size);
    }
    @GetMapping("/products/{slug}")
    ProductDetail product(@PathVariable String slug) { return service.getProduct(slug); }
    @GetMapping("/categories")
    List<Category> categories() { return service.getCategories(); }
    @GetMapping("/brands")
    List<Brand> brands() { return service.getBrands(); }
}