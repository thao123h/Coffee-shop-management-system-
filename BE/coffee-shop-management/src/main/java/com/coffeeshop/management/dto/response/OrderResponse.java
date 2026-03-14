package com.coffeeshop.management.dto.response;

import com.coffeeshop.management.enums.OrderStatus;
import com.coffeeshop.management.enums.PaymentMethod;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private String staffName;
    private String voucherCode;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private PaymentMethod paymentMethod;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> orderItems;


}
