package com.coffeeshop.order.controller;

import com.coffeeshop.order.enums.OrderStatus;
import com.coffeeshop.order.service.OrderService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Internal endpoint called by Payment Service after PayOS webhook.
 */
@RestController
@RequestMapping("/internal/orders")
@RequiredArgsConstructor
public class InternalOrderController {

    @Value("${internal.service-token}")
    private String serviceToken;

    private final OrderService orderService;

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest req,
            @RequestHeader("X-Internal-Service-Token") String token) {
        if (!serviceToken.equals(token)) throw new SecurityException("Invalid token");
        OrderStatus status = OrderStatus.valueOf(req.getStatus());
        orderService.updateStatus(id, status);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class UpdateStatusRequest {
        private String status;
    }
}
