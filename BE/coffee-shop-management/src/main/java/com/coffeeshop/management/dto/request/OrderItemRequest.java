package com.coffeeshop.management.dto.request;

import com.coffeeshop.management.entity.Order;
import com.coffeeshop.management.entity.ProductVariant;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderItemRequest {

     @NotNull
     private Long productVariantId;
     @NotNull
     private Integer quantity;
     private String note;
     List<Long> toppings;

}


