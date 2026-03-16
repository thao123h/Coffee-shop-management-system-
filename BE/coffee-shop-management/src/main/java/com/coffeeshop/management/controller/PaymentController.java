package com.coffeeshop.management.controller;

import com.coffeeshop.management.dto.response.ApiResponse;
import com.coffeeshop.management.dto.response.PaymentResponse;
import com.coffeeshop.management.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

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

