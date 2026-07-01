package com.coffeeshop.order.client.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ToppingSnapshotDto {
    private Long toppingId;
    private String toppingName;
    private BigDecimal price;
    private Boolean isActive;
}
