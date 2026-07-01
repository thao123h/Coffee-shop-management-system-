package com.coffeeshop.menu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ToppingSnapshotDto {
    private Long toppingId;
    private String toppingName;
    private BigDecimal price;
    private Boolean isActive;
}
