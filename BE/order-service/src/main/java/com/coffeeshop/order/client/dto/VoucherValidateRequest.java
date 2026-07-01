package com.coffeeshop.order.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class VoucherValidateRequest {
    private BigDecimal orderAmount;
    private Long userId;
}
