package com.coffeeshop.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {
    private Long paymentId;
    private String status;    // PENDING | SUCCESS | FAILED
    private String payUrl;    // PayOS checkout link (only for BANK payment)
    private String message;
}
