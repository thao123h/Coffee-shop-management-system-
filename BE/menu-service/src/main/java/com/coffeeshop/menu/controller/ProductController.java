package com.coffeeshop.menu.controller;

import com.coffeeshop.menu.dto.ApiResponse;
import com.coffeeshop.menu.dto.ProductRequest;
import com.coffeeshop.menu.entity.Product;
import com.coffeeshop.menu.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /** Paginated + keyword + activeOnly filter — used by FE product management */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Product>>> getAll(
            @RequestParam(defaultValue = "0")     int page,
            @RequestParam(defaultValue = "10")    int size,
            @RequestParam(defaultValue = "")      String keyword,
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        Page<Product> result = productService.getPage(page, size, keyword, activeOnly);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    /** Simple list by category — used by POS modal */
    @GetMapping("/by-category")
    public ResponseEntity<ApiResponse<List<Product>>> getByCategory(
            @RequestParam Long categoryId) {
        return ResponseEntity.ok(ApiResponse.success(productService.getByCategoryId(categoryId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(productService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Product>> create(@Valid @RequestBody ProductRequest req) {
        return ResponseEntity.ok(ApiResponse.success(productService.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> update(
            @PathVariable Long id, @Valid @RequestBody ProductRequest req) {
        return ResponseEntity.ok(ApiResponse.success(productService.update(id, req)));
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<Product>> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(productService.toggleActive(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
