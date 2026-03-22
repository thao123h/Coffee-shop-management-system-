package com.coffeeshop.management.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardResponse {
    private long totalOrders;
    private long pendingOrders;
    private long completedOrders;
    private long cancelledOrders;
    private BigDecimal totalRevenue;
    private long totalProducts;
    private long totalCategories;
    private long totalUsers;
    private List<OrderResponse> recentOrders;
    private List<Map<String, Object>> topProducts;
    private List<Map<String, Object>> dailyRevenue;
}
