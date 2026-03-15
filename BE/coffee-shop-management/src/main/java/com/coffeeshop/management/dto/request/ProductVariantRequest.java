package com.coffeeshop.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductVariantRequest {

    @NotBlank(message = "Variant name is required")
    private String name;

    @NotNull(message = "Variant price is required")
    private BigDecimal price;

    private String skuCode;

    private Boolean isActive = true;
}
