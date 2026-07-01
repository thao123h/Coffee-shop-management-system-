package com.coffeeshop.payment.controller;

import com.coffeeshop.payment.entity.Payment;
import com.coffeeshop.payment.enums.PaymentStatus;
import com.coffeeshop.payment.repository.PaymentRepository;
import com.coffeeshop.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;

    @GetMapping
    public ResponseEntity<List<Payment>> getAll() {
        return ResponseEntity.ok(paymentService.getAll());
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getByOrderId(orderId));
    }

    /**
     * FE calls this for BANK payment to get/refresh the payUrl.
     * Returns existing payment record for the order (including payUrl).
     */
    @PostMapping("/{orderId}")
    public ResponseEntity<Payment> getOrCreatePayment(@PathVariable Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("No payment found for order: " + orderId));
        return ResponseEntity.ok(payment);
    }

    /**
     * FE calls this to cancel a pending BANK payment.
     */
    @PostMapping("/cancel/{orderId}")
    public ResponseEntity<Map<String, String>> cancelPayment(@PathVariable Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId).orElse(null);
        if (payment != null && payment.getStatus() == PaymentStatus.PROCESSING) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
        }
        return ResponseEntity.ok(Map.of("message", "Payment cancelled"));
    }

    /**
     * PayOS webhook — called by PayOS after payment is processed.
     * Must be PUBLIC (no JWT required).
     */
    @PostMapping("/payos/callback")
    public ResponseEntity<Map<String, String>> payosCallback(@RequestBody Map<String, Object> payload) {
        log.info("PayOS callback received: {}", payload);
        paymentService.handlePayOSCallback(payload);
        return ResponseEntity.ok(Map.of("code", "00", "desc", "success"));
    }

    @GetMapping("/payos/cancel")
    public ResponseEntity<Map<String, String>> payosCancel(
            @RequestParam(required = false) Long orderCode) {
        log.info("PayOS cancel for orderCode={}", orderCode);
        return ResponseEntity.ok(Map.of("message", "Payment cancelled"));
    }
}
