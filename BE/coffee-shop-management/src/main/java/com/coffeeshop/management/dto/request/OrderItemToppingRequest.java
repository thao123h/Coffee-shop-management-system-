package com.coffeeshop.management.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderItemToppingRequest {
    @NotNull(message = "OrderItemId is required")
    private Long orderItemId;

    @NotNull(message = "ToppingId is required")
    private Long toppingId;

}
