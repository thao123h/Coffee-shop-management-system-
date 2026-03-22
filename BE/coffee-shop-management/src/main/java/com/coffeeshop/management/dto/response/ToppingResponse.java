package com.coffeeshop.management.dto.response;

import com.coffeeshop.management.entity.Topping;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ToppingResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    
    @JsonProperty("isActive")
    private Boolean isActive;

    public static ToppingResponse from(Topping t) {
        ToppingResponse r = new ToppingResponse();
        r.id = t.getId();
        r.name = t.getName();
        r.price = t.getPrice();
        r.isActive = t.getIsActive() != null ? t.getIsActive() : true;
        return r;
    }
}
