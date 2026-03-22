package com.coffeeshop.management.service;

import com.coffeeshop.management.dto.response.DashboardResponse;
import com.coffeeshop.management.dto.response.OrderResponse;
import com.coffeeshop.management.enums.OrderStatus;
import com.coffeeshop.management.enums.Role;
import com.coffeeshop.management.mapper.OrderMapper;
import com.coffeeshop.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

    public DashboardResponse getDashboardStats() {
        BigDecimal totalRevenue = orderRepository.findByStatus(OrderStatus.COMPLETED)
                .stream()
                .map(order -> order.getFinalAmount() != null ? order.getFinalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<OrderResponse> recentOrders = orderRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(orderMapper::toOrderResponse)
                .collect(Collectors.toList());

        List<Object[]> topProductsRaw = orderItemRepository.findTopSellingProducts(PageRequest.of(0, 5));
        List<Map<String, Object>> topProducts = topProductsRaw.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", row[0]);
            map.put("sales", row[1]);
            map.put("revenue", row[2]);
            return map;
        }).collect(Collectors.toList());

        // Daily revenue for last 7 days
        List<Map<String, Object>> dailyRevenue = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");
        for (int i = 6; i >= 0; i--) {
            LocalDateTime start = LocalDateTime.now().minusDays(i).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime end = LocalDateTime.now().minusDays(i).withHour(23).withMinute(59).withSecond(59);
            BigDecimal dayRevenue = orderRepository.findByCreatedAtBetween(start, end)
                    .stream()
                    .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                    .map(o -> o.getFinalAmount() != null ? o.getFinalAmount() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            Map<String, Object> map = new HashMap<>();
            map.put("date", start.format(formatter));
            map.put("revenue", dayRevenue);
            dailyRevenue.add(map);
        }

        return DashboardResponse.builder()
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countByStatus(OrderStatus.PENDING))
                .completedOrders(orderRepository.countByStatus(OrderStatus.COMPLETED))
                .cancelledOrders(orderRepository.countByStatus(OrderStatus.CANCELLED))
                .totalRevenue(totalRevenue)
                .totalProducts(productRepository.count())
                .totalCategories(categoryRepository.count())
                .totalUsers(userRepository.countByRoleNot(Role.ADMIN))
                .recentOrders(recentOrders)
                .topProducts(topProducts)
                .dailyRevenue(dailyRevenue)
                .build();
    }
}
