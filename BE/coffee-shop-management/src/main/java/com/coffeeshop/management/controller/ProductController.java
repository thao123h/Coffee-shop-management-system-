 package com.coffeeshop.management.controller;

import com.coffeeshop.management.dto.request.ProductRequest;
import com.coffeeshop.management.dto.request.ProductVariantRequest;
import com.coffeeshop.management.dto.response.ApiResponse;
import com.coffeeshop.management.dto.response.ProductResponse;
import com.coffeeshop.management.entity.Category;
import com.coffeeshop.management.entity.Product;
import com.coffeeshop.management.entity.ProductVariant;
import com.coffeeshop.management.enums.ErrorCode;
import com.coffeeshop.management.service.CategoryService;
import com.coffeeshop.management.service.ProductService;
import com.coffeeshop.management.service.ProductVariantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final CategoryService categoryService;
    private final ProductVariantService productVariantService;

    /** GET /products — Lấy tất cả sản phẩm */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        Page<Product> products = productService.findAll(page, size, keyword, activeOnly);
        Page<ProductResponse> responses = products.map(ProductResponse::from);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }


    /** GET /products/active — Chỉ lấy sản phẩm đang bán */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getActiveProducts() {
        List<ProductResponse> list = productService.findAllActive()
                .stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    /** GET /products/category/{categoryId} — Lọc theo danh mục */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getByCategory(@PathVariable Long categoryId) {
        List<ProductResponse> list = productService.findByCategoryId(categoryId)
                .stream()
                .map(ProductResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    /** GET /products/{id} — Lấy chi tiết một sản phẩm */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        return productService.findById(id)
                .map(p -> ResponseEntity.ok(ApiResponse.success(ProductResponse.from(p))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.<ProductResponse>error(ErrorCode.NOT_FOUND)));
    }

    /** POST /products — Tạo sản phẩm mới */
    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest request) {
        Category category = categoryService.findById(request.getCategoryId()).orElse(null);
        if (category == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.<ProductResponse>error(ErrorCode.NOT_FOUND));
        }

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .hasMultipleSizes(request.getHasMultipleSizes())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .category(category)
                .build();

        Product saved = productService.save(product);

        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (ProductVariantRequest vr : request.getVariants()) {
                String variantName = (vr.getName() == null || vr.getName().trim().isEmpty()) ? "Standard" : vr.getName();
                ProductVariant variant = ProductVariant.builder()
                        .product(saved)
                        .name(variantName)
                        .price(vr.getPrice())
                        .skuCode(vr.getSkuCode())
                        .isActive(vr.getIsActive() != null ? vr.getIsActive() : true)
                        .build();
                productVariantService.save(variant);
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(ProductResponse.from(saved)));
    }

    /** PUT /products/{id} — Cập nhật sản phẩm */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {

        return productService.findById(id).map(product -> {
            Category category = categoryService.findById(request.getCategoryId()).orElse(null);
            if (category == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.<ProductResponse>error(ErrorCode.NOT_FOUND));
            }
            product.setName(request.getName());
            product.setDescription(request.getDescription());
            product.setImageUrl(request.getImageUrl());
            product.setHasMultipleSizes(request.getHasMultipleSizes());
            product.setIsActive(request.getIsActive() != null ? request.getIsActive() : product.getIsActive());
            product.setCategory(category);

            Product updated = productService.save(product);

            if (request.getVariants() != null) {
                productVariantService.deleteByProductId(updated.getId());
                for (ProductVariantRequest vr : request.getVariants()) {
                    String variantName = (vr.getName() == null || vr.getName().trim().isEmpty()) ? "Standard" : vr.getName();
                    ProductVariant variant = ProductVariant.builder()
                            .product(updated)
                            .name(variantName)
                            .price(vr.getPrice())
                            .skuCode(vr.getSkuCode())
                            .isActive(vr.getIsActive() != null ? vr.getIsActive() : true)
                            .build();
                    productVariantService.save(variant);
                }
            }

            return ResponseEntity.ok(ApiResponse.success(ProductResponse.from(updated)));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.<ProductResponse>error(ErrorCode.NOT_FOUND)));
    }

    /** PUT /products/{id}/toggle-active — Bật/tắt trạng thái bán */
    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<ProductResponse>> toggleActive(@PathVariable Long id) {
        return productService.findById(id).map(product -> {
            product.setIsActive(!product.getIsActive());
            Product updated = productService.save(product);
            return ResponseEntity.ok(ApiResponse.success(ProductResponse.from(updated)));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.<ProductResponse>error(ErrorCode.NOT_FOUND)));
    }

    /** DELETE /products/{id} — Xóa sản phẩm */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        if (!productService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<Void>error(ErrorCode.NOT_FOUND));
        }
        productService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

}
