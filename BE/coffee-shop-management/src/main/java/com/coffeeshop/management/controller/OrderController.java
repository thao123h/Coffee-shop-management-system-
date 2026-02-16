package com.coffeeshop.management.controller;

import com.coffeeshop.management.dto.response.ApiResponse;
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


}
