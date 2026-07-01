package com.coffeeshop.order.client.dto;

import lombok.Data;

@Data
public class PaymentResponse {
    private Long paymentId;
    private String status;    // PENDING | SUCCESS | FAILED
    private String payUrl;    // PayOS checkout link (only for BANK)
    private String message;
}
