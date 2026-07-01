package com.coffeeshop.order.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePaymentRequest {
    private Long orderId;
    private BigDecimal amount;
    private String paymentMethod;   // "CASH" | "BANK"
    private String description;
}
