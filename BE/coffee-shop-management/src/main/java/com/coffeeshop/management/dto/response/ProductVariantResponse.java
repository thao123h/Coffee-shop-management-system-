package com.coffeeshop.management.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantResponse {

    private Long id;

    private String name;

    private BigDecimal price;

    private String skuCode;

    private Boolean isActive;

}