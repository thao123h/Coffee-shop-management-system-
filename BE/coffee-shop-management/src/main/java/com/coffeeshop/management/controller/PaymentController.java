package com.coffeeshop.management.controller;

import com.coffeeshop.management.dto.response.ApiResponse;
import com.coffeeshop.management.dto.response.PaymentResponse;
import com.coffeeshop.management.entity.Order;
import com.coffeeshop.management.enums.PaymentProvider;
import com.coffeeshop.management.repository.OrderRepository;
import com.coffeeshop.management.service.OrderService;
import com.coffeeshop.management.service.PayOSService;
import com.coffeeshop.management.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
   private final PaymentService paymentService;
   private final PayOSService payOSService;
   private final OrderService orderService;
   private final OrderRepository orderRepository;
    @PostMapping("/{id}")
    public ResponseEntity<?> createPayment(@PathVariable Long id) {
        Order order = orderRepository.findById(id).get();


        String url = payOSService.createPaymentLink(id, order.getFinalAmount().intValue());
        return ResponseEntity.ok(Map.of("checkoutUrl", url));
    }
    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody Map<String, Object> payload) {
        System.out.println("Payload: " + payload);

        try {
            String receivedSignature = (String) payload.get("signature");
            Map<String, Object> data = (Map<String, Object>) payload.get("data");

//             String generatedSignature = payOSService.generateSignature(data);
//             if (!generatedSignature.equals(receivedSignature)) {
//                 return ResponseEntity.badRequest().body("Invalid signature");
//             }

            Long orderCode = Long.valueOf(data.get("orderCode").toString());
            int amount = Integer.parseInt(data.get("amount").toString());
            String code = data.get("code").toString();
            String txnRef = data.get("reference").toString();

            if ("00".equals(code)) {
                paymentService.createPaymentFromWebhook(orderCode, amount, txnRef, PaymentProvider.BANK_TRANSFER);
                orderService.markAsPaid(orderCode);
            } else {
                orderService.markAsFailed(orderCode);
            }

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok().build(); // ⚠️ webhook nên luôn trả 200
        }
    }


    @GetMapping
    public ResponseEntity<ApiResponse<Page<PaymentResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "") String status,
            @RequestParam(defaultValue = "") String provider,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {

        Page<PaymentResponse> result = paymentService.findAllPaged(
                page, size,
                keyword.isBlank() ? null : keyword,
                status.isBlank() ? null : status,
                provider.isBlank() ? null : provider,
                fromDate, toDate);

        return ResponseEntity.ok(ApiResponse.success(result));
    }
}

