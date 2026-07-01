package com.coffeeshop.order.dto;

import com.coffeeshop.order.entity.Order;
import lombok.Data;

@Data
public class OrderResponse {
    private Order order;
    private String payUrl;   // populated for BANK orders

    public static OrderResponse of(Order order, String payUrl) {
        OrderResponse r = new OrderResponse();
        r.setOrder(order);
        r.setPayUrl(payUrl);
        return r;
    }
}
