package com.coffeeshop.payment.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePaymentRequest {
    private Long orderId;
    private BigDecimal amount;
    private String paymentMethod;   // "CASH" | "BANK"
    private String description;
}
