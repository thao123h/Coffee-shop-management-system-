package com.coffeeshop.promotion.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class VoucherApplyRequest {
    private Long orderId;
    private Long userId;
    private BigDecimal discountApplied;
}
