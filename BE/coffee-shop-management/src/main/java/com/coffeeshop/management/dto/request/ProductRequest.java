package com.coffeeshop.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class ProductRequest {

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    private String imageUrl;

    @NotNull(message = "hasMultipleSizes is required")
    private Boolean hasMultipleSizes;

    private Boolean isActive = true;

    private List<ProductVariantRequest> variants;
}
