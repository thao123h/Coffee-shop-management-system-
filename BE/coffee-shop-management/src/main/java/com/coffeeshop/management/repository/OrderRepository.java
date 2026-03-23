package com.coffeeshop.management.repository;

import com.coffeeshop.management.entity.Order;
import com.coffeeshop.management.enums.OrderStatus;
import com.coffeeshop.management.enums.PaymentMethod;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStaffId(Long staffId);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Order> findTop10ByOrderByCreatedAtDesc();
    long countByStatus(OrderStatus status);



    @Query("""
        SELECT o FROM Order o
        WHERE (:orderId IS NULL OR o.id = :orderId)
        AND (:status IS NULL OR o.status = :status)
        AND (:paymentMethod IS NULL OR o.paymentMethod = :paymentMethod)
        AND (:fromDate IS NULL OR o.createdAt >= :fromDate)
        AND (:toDate IS NULL OR o.createdAt <= :toDate)
        ORDER BY o.createdAt DESC
    """)
    Page<Order> filterOrders(
            @Param("orderId") Long orderId,
            @Param("status") OrderStatus status,
            @Param("paymentMethod") PaymentMethod paymentMethod,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );
}
