package com.coffeeshop.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderItemRequest {
    @NotNull
    private Long productVariantId;
    @NotNull @Min(1)
    private Integer quantity;
    private String note;
    private List<Long> toppingIds;
}
