package com.coffeeshop.menu.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductVariantRequest {
    @NotNull
    private Long productId;
    @NotBlank
    private String name;
    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;
    private String skuCode;
}
