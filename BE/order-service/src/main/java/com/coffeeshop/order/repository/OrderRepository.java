package com.coffeeshop.order.repository;

import com.coffeeshop.order.entity.Order;
import com.coffeeshop.order.enums.OrderStatus;
import com.coffeeshop.order.enums.PaymentMethod;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    List<Order> findByStatus(OrderStatus status);

    @Query("""
        SELECT o FROM Order o WHERE
            (:orderId   IS NULL OR o.id            = :orderId)
        AND (:status    IS NULL OR o.status         = :status)
        AND (:method    IS NULL OR o.paymentMethod  = :method)
        AND (:from      IS NULL OR o.createdAt     >= :from)
        AND (:to        IS NULL OR o.createdAt     <= :to)
        ORDER BY o.createdAt DESC
    """)
    Page<Order> filterOrders(
            @Param("orderId") Long orderId,
            @Param("status")  OrderStatus status,
            @Param("method")  PaymentMethod method,
            @Param("from")    LocalDateTime from,
            @Param("to")      LocalDateTime to,
            Pageable pageable
    );
}
