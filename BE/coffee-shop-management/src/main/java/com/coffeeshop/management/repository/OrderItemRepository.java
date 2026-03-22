package com.coffeeshop.management.repository;

import com.coffeeshop.management.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);

    @org.springframework.data.jpa.repository.Query("SELECT oi.productName AS name, SUM(oi.quantity) AS sales, SUM(oi.unitPrice * oi.quantity) AS revenue " +
           "FROM OrderItem oi JOIN oi.order o " +
           "WHERE o.status = 'COMPLETED' " +
           "GROUP BY oi.productName " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTopSellingProducts(org.springframework.data.domain.Pageable pageable);
}
