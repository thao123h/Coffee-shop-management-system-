package com.coffeeshop.payment.controller;

import com.coffeeshop.payment.dto.CreatePaymentRequest;
import com.coffeeshop.payment.dto.PaymentResponse;
import com.coffeeshop.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Internal endpoint — called only by Order Service via Feign Client.
 * Protected by X-Internal-Service-Token header.
 */
@RestController
@RequestMapping("/internal/payments")
@RequiredArgsConstructor
public class InternalPaymentController {

    @Value("${internal.service-token}")
    private String serviceToken;

    private final PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<PaymentResponse> createPayment(
            @RequestBody CreatePaymentRequest req,
            @RequestHeader("X-Internal-Service-Token") String token) {
        if (!serviceToken.equals(token)) {
            throw new SecurityException("Invalid internal service token");
        }
        return ResponseEntity.ok(paymentService.createPayment(req));
    }
}
