package com.coffeeshop.order.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "ms_order_item_toppings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItemTopping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    @Column(name = "topping_id", nullable = false)
    private Long toppingId;

    @Column(name = "topping_name", nullable = false)
    private String toppingName;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;
}
