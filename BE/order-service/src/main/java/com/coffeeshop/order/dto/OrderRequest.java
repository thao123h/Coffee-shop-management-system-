package com.coffeeshop.order.dto;

import com.coffeeshop.order.enums.PaymentMethod;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private String customerName;
    @NotNull
    private PaymentMethod paymentMethod;
    private String voucherCode;
    @NotEmpty
    private List<OrderItemRequest> orderItems;
}
