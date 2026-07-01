package com.coffeeshop.menu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VariantSnapshotDto {
    private Long variantId;
    private String productName;
    private String variantName;
    private BigDecimal price;
    private Boolean isActive;
}
