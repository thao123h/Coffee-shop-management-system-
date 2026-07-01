package com.coffeeshop.menu.controller;

import com.coffeeshop.menu.dto.ApiResponse;
import com.coffeeshop.menu.dto.ProductVariantRequest;
import com.coffeeshop.menu.entity.ProductVariant;
import com.coffeeshop.menu.service.ProductVariantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/variants")
@RequiredArgsConstructor
public class ProductVariantController {

    private final ProductVariantService variantService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductVariant>>> getByProduct(
            @RequestParam Long productId) {
        return ResponseEntity.ok(ApiResponse.success(variantService.getByProductId(productId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductVariant>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(variantService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductVariant>> create(
            @Valid @RequestBody ProductVariantRequest req) {
        return ResponseEntity.ok(ApiResponse.success(variantService.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductVariant>> update(
            @PathVariable Long id, @Valid @RequestBody ProductVariantRequest req) {
        return ResponseEntity.ok(ApiResponse.success(variantService.update(id, req)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        variantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
