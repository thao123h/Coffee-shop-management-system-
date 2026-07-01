package com.coffeeshop.order.client.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class VariantSnapshotDto {
    private Long variantId;
    private String productName;
    private String variantName;
    private BigDecimal price;
    private Boolean isActive;
}
