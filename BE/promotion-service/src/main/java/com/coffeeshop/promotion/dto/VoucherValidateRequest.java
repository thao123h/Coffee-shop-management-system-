package com.coffeeshop.promotion.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class VoucherValidateRequest {
    private BigDecimal orderAmount;
    private Long userId;    // nullable for guest
}
