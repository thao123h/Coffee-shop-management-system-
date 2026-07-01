package com.coffeeshop.promotion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VoucherValidateResponse {
    private boolean valid;
    private String voucherCode;
    private BigDecimal discountValue;
    private BigDecimal calculatedDiscount;
    private BigDecimal finalAmount;
    private String errorCode;
    private String message;
}
