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

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
       OrderResponse orderResponse = orderService.createOrder(orderRequest);
       return ResponseEntity.ok(ApiResponse.success(orderResponse));
    }


}
