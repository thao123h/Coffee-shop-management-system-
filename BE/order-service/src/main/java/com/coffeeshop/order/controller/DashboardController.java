package com.coffeeshop.order.controller;

import com.coffeeshop.order.enums.OrderStatus;
import com.coffeeshop.order.repository.OrderRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class DashboardController {

    private final OrderRepository orderRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboard() {
        long totalOrders     = orderRepository.count();
        long pendingOrders   = orderRepository.findByStatus(OrderStatus.PENDING).size();
        long completedOrders = orderRepository.findByStatus(OrderStatus.COMPLETED).size();
        long cancelledOrders = orderRepository.findByStatus(OrderStatus.CANCELLED).size();

        BigDecimal totalRevenue = orderRepository.findByStatus(OrderStatus.COMPLETED)
                .stream()
                .map(o -> o.getFinalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Today's revenue
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        BigDecimal todayRevenue = orderRepository
                .filterOrders(null, OrderStatus.COMPLETED, null, startOfDay, null,
                        org.springframework.data.domain.PageRequest.of(0, Integer.MAX_VALUE))
                .stream()
                .map(o -> o.getFinalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ResponseEntity.ok(new DashboardStats(
                totalOrders, pendingOrders, completedOrders, cancelledOrders,
                totalRevenue, todayRevenue
        ));
    }

    @GetMapping("/traffic")
    public ResponseEntity<Map<String, Object>> getTraffic() {
        return ResponseEntity.ok(Map.of(
                "message", "Traffic monitoring not implemented in microservices mode",
                "totalRequests", 0
        ));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalOrders = orderRepository.count();
        return ResponseEntity.ok(Map.of(
                "totalOrders", totalOrders,
                "message", "User stats managed by user-service"
        ));
    }

    @Data
    @AllArgsConstructor
    static class DashboardStats {
        private long totalOrders;
        private long pendingOrders;
        private long completedOrders;
        private long cancelledOrders;
        private BigDecimal totalRevenue;
        private BigDecimal todayRevenue;
    }
}
