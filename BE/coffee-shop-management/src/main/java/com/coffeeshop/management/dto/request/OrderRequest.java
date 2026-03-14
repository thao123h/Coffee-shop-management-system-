package com.coffeeshop.management.dto.request;

import com.coffeeshop.management.enums.OrderStatus;
import com.coffeeshop.management.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {
    @NotNull
    private Long voucherId;
    @NotNull
    private PaymentMethod paymentMethod;
    @NotNull
    private OrderStatus orderStatus;
    @NotNull
    private List<OrderItemRequest> orderItems;

}
