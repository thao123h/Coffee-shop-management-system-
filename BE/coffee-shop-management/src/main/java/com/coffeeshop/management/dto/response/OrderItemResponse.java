package com.coffeeshop.management.dto.response;

import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data

public class OrderItemResponse {
    private String productName;
    private String variantName;
    private BigDecimal unitPrice;
    private Integer quantity;
    private String note;
    List<ToppingResponse> toppings;

}
