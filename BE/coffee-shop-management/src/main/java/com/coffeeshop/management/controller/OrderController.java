package com.coffeeshop.management.controller;

import com.coffeeshop.management.dto.request.OrderRequest;
import com.coffeeshop.management.dto.response.ApiResponse;
import com.coffeeshop.management.dto.response.MessageResponse;
import com.coffeeshop.management.dto.response.OrderResponse;
import com.coffeeshop.management.entity.Order;
import com.coffeeshop.management.enums.ErrorCode;
import com.coffeeshop.management.enums.OrderStatus;
import com.coffeeshop.management.service.OrderService;
import com.coffeeshop.management.service.UserService;
import com.coffeeshop.management.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {


    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page, @RequestParam int size
    ) {
        Page<OrderResponse> orderResponsePage = orderService.getAllOrders(page, size);
        return ResponseEntity.ok(ApiResponse.success(orderResponsePage));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
       OrderResponse orderResponse = orderService.createOrder(orderRequest);
       return ResponseEntity.ok(ApiResponse.success(orderResponse));
    }
    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<OrderResponse>> completeOrder(
            @PathVariable Long id) {

        OrderResponse response = orderService.completeOrder(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    // Cancel Order
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @PathVariable Long id) {

        OrderResponse response = orderService.cancelOrder(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(@PathVariable Long id) {
        OrderResponse orderResponse = orderService.getOrderResponseById(id);
        return ResponseEntity.ok(ApiResponse.success(orderResponse));
    }


}
