package com.coffeeshop.management.controller;

import com.coffeeshop.management.dto.response.ApiResponse;
import com.coffeeshop.management.dto.response.ProductResponse;
import com.coffeeshop.management.dto.response.ProductVariantResponse;
import com.coffeeshop.management.entity.ProductVariant;
import com.coffeeshop.management.enums.ErrorCode;
import com.coffeeshop.management.service.ProductService;
import com.coffeeshop.management.service.ProductVariantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/product-variants")
@RequiredArgsConstructor
public class ProductVariantController {
    private final ProductVariantService productVariantService;
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductVariantResponse>>> getAllProductVariantsByProductID(
            @RequestParam String productId
    ) {
        List<ProductVariantResponse> list = productVariantService.findProductVariantsByProductId(Long.parseLong(productId));
        return ResponseEntity.ok(ApiResponse.success(list));
    }

}
