package com.coffeeshop.management.dto.response;

import com.coffeeshop.management.enums.PaymentProvider;
import com.coffeeshop.management.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {

    private Long id;
    private Long orderId;
    private PaymentProvider provider;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private String txnRef;
    private String transactionNo;
    private String bankCode;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}
