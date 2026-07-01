package com.coffeeshop.payment.service;

import com.coffeeshop.payment.client.OrderServiceClient;
import com.coffeeshop.payment.client.dto.UpdateStatusRequest;
import com.coffeeshop.payment.dto.CreatePaymentRequest;
import com.coffeeshop.payment.dto.PaymentResponse;
import com.coffeeshop.payment.entity.Payment;
import com.coffeeshop.payment.enums.PaymentProvider;
import com.coffeeshop.payment.enums.PaymentStatus;
import com.coffeeshop.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PayOSService      payOSService;
    private final OrderServiceClient orderServiceClient;

    /**
     * Called by Order Service via Feign to create a payment record.
     * CASH  → confirms immediately, notifies Order Service.
     * BANK  → creates PayOS link, returns payUrl for FE redirect.
     */
    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest req) {
        // Prevent duplicate
        if (paymentRepository.findByOrderId(req.getOrderId()).isPresent()) {
            Payment existing = paymentRepository.findByOrderId(req.getOrderId()).get();
            return PaymentResponse.builder()
                    .paymentId(existing.getId())
                    .status(existing.getStatus().name())
                    .payUrl(existing.getPayUrl())
                    .message("Payment already exists")
                    .build();
        }

        PaymentProvider provider = "CASH".equals(req.getPaymentMethod())
                ? PaymentProvider.CASH
                : PaymentProvider.PAYOS;

        String txnRef = "TXN-" + req.getOrderId() + "-" + System.currentTimeMillis();

        Payment payment = Payment.builder()
                .orderId(req.getOrderId())
                .amount(req.getAmount())
                .currency("VND")
                .provider(provider)
                .status(PaymentStatus.PENDING)
                .txnRef(txnRef)
                .build();
        payment = paymentRepository.save(payment);

        if (provider == PaymentProvider.CASH) {
            return confirmCash(payment);
        } else {
            return createPayOSLink(payment, req);
        }
    }

    private PaymentResponse confirmCash(Payment payment) {
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Notify Order Service via Feign
        notifyOrderStatus(payment.getOrderId(), "CONFIRMED");

        log.info("Cash payment confirmed for orderId={}", payment.getOrderId());
        return PaymentResponse.builder()
                .paymentId(payment.getId())
                .status("SUCCESS")
                .message("Cash payment confirmed")
                .build();
    }

    private PaymentResponse createPayOSLink(Payment payment, CreatePaymentRequest req) {
        try {
            String payUrl = payOSService.createPaymentLink(
                    req.getOrderId(),
                    req.getAmount().intValue(),
                    req.getDescription()
            );
            payment.setPayUrl(payUrl);
            payment.setStatus(PaymentStatus.PROCESSING);
            paymentRepository.save(payment);

            log.info("PayOS link created for orderId={}", req.getOrderId());
            return PaymentResponse.builder()
                    .paymentId(payment.getId())
                    .status("PROCESSING")
                    .payUrl(payUrl)
                    .message("Redirect user to payUrl")
                    .build();
        } catch (Exception e) {
            log.error("PayOS link creation failed for orderId={}: {}", req.getOrderId(), e.getMessage());
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);

            notifyOrderStatus(payment.getOrderId(), "FAILED");

            return PaymentResponse.builder()
                    .paymentId(payment.getId())
                    .status("FAILED")
                    .message("Failed to create payment link: " + e.getMessage())
                    .build();
        }
    }

    /**
     * PayOS webhook — called directly by PayOS after user completes/cancels payment.
     */
    @Transactional
    public void handlePayOSCallback(Map<String, Object> payload) {
        String code = String.valueOf(payload.get("code"));
        Long orderCode = Long.valueOf(String.valueOf(payload.get("orderCode")));
        String transactionNo = String.valueOf(payload.getOrDefault("reference", ""));

        Payment payment = paymentRepository.findByOrderId(orderCode).orElse(null);
        if (payment == null) {
            log.warn("No payment found for PayOS orderCode={}", orderCode);
            return;
        }

        boolean success = "00".equals(code);
        payment.setTransactionNo(transactionNo);
        payment.setResponseCode(code);
        payment.setStatus(success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
        if (success) payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Notify Order Service via Feign
        notifyOrderStatus(orderCode, success ? "CONFIRMED" : "FAILED");

        log.info("PayOS callback handled for orderId={}, success={}", orderCode, success);
    }

    private void notifyOrderStatus(Long orderId, String status) {
        try {
            orderServiceClient.updateOrderStatus(
                    orderId,
                    new UpdateStatusRequest(status)
            );
        } catch (Exception e) {
            log.error("Failed to notify Order Service for orderId={}: {}", orderId, e.getMessage());
        }
    }

    public Payment getByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for orderId: " + orderId));
    }

    public List<Payment> getAll() {
        return paymentRepository.findAll();
    }
}
