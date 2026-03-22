package com.coffeeshop.management.controller;

import com.coffeeshop.management.dto.response.ApiResponse;
import com.coffeeshop.management.entity.Order;
import com.coffeeshop.management.entity.Payment;
import com.coffeeshop.management.enums.ErrorCode;
import com.coffeeshop.management.enums.PaymentProvider;
import com.coffeeshop.management.enums.PaymentStatus;
import com.coffeeshop.management.repository.OrderRepository;
import com.coffeeshop.management.service.OrderService;
import com.coffeeshop.management.service.PayOSService;
import com.coffeeshop.management.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
   private final PaymentService paymentService;
   private final PayOSService payOSService;
   private final   OrderService orderService;
   private final OrderRepository orderRepository;
    @PostMapping("/{id}")
    public ResponseEntity<?> createPayment(@PathVariable Long id) {
        Order order = orderRepository.findById(id).get();


        String url = payOSService.createPaymentLink(id, order.getFinalAmount().intValue());
        return ResponseEntity.ok(Map.of("checkoutUrl", url));
    }
    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody Map<String, Object> payload) {

        try {
            // 1. Lấy signature từ PayOS
            String receivedSignature = (String) payload.get("signature");

            // 2. Remove signature để build lại rawData
            Map<String, Object> data = new HashMap<>(payload);
            data.remove("signature");

            // 3. Tạo lại signature từ data
            String generatedSignature = payOSService.generateSignature(data);

            // 4. Verify signature
            if (!generatedSignature.equals(receivedSignature)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
            }

            // 5. Lấy thông tin
            Long orderCode = Long.valueOf(data.get("orderCode").toString());
            String status = data.get("status").toString();
            String txnRef = data.get("txnRef").toString();
            int amount = Integer.parseInt(data.get("amount").toString());

            // 6. Nếu thanh toán thành công, tạo payment và update order
            if ("PAID".equals(status)) {
                paymentService.createPaymentFromWebhook(orderCode, amount, txnRef, PaymentProvider.BANK_TRANSFER);
                orderService.markAsPaid(orderCode);
            } else if ("CANCELLED".equals(status)) {
                orderService.markAsCancelled(orderCode);
            } else {
                orderService.markAsFailed(orderCode);
            }

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}
