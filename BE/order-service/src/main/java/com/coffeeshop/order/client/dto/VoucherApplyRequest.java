package com.coffeeshop.order.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class VoucherApplyRequest {
    private Long orderId;
    private Long userId;
    private BigDecimal discountApplied;
}
