package com.coffeeshop.order.controller;

import com.coffeeshop.order.dto.ApiResponse;
import com.coffeeshop.order.dto.OrderRequest;
import com.coffeeshop.order.dto.OrderResponse;
import com.coffeeshop.order.entity.Order;
import com.coffeeshop.order.enums.OrderStatus;
import com.coffeeshop.order.enums.PaymentMethod;
import com.coffeeshop.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody OrderRequest req,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        OrderResponse response = orderService.createOrder(req, userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Order>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long orderId,
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) PaymentMethod paymentMethod,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {

        LocalDateTime from = fromDate != null ? fromDate.atStartOfDay() : null;
        LocalDateTime to   = toDate   != null ? toDate.atTime(23, 59, 59) : null;
        return ResponseEntity.ok(ApiResponse.success(
                orderService.getAll(page, size, orderId, status, paymentMethod, from, to)));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<Order>> complete(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateStatus(id, OrderStatus.COMPLETED)));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Order>> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateStatus(id, OrderStatus.CANCELLED)));
    }

    @PatchMapping("/{id}/preparing")
    public ResponseEntity<ApiResponse<Order>> preparing(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateStatus(id, OrderStatus.PREPARING)));
    }

    @PatchMapping("/{id}/ready")
    public ResponseEntity<ApiResponse<Order>> ready(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateStatus(id, OrderStatus.READY)));
    }
}
