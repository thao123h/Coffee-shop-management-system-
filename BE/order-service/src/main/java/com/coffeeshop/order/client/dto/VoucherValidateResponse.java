package com.coffeeshop.order.client.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class VoucherValidateResponse {
    private boolean valid;
    private String voucherCode;
    private BigDecimal discountValue;
    private BigDecimal calculatedDiscount;
    private BigDecimal finalAmount;
    private String errorCode;
    private String message;
}
