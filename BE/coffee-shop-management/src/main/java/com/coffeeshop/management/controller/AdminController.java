package com.coffeeshop.management.controller;

import com.coffeeshop.management.dto.response.ApiResponse;
import com.coffeeshop.management.dto.response.UserResponse;
import com.coffeeshop.management.dto.response.DashboardResponse;
import com.coffeeshop.management.service.DashboardService;
import com.coffeeshop.management.service.TrafficService;
import com.coffeeshop.management.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Admin-only controller providing user statistics and system traffic data.
 * All endpoints require ADMIN authority (enforced by WebSecurityConfig + @PreAuthorize).
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final TrafficService trafficService;
    private final DashboardService dashboardService;

    /**
     * GET /admin/stats — Returns user statistics grouped by role.
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserStats() {
        List<UserResponse> allUsers = userService.findAll()
                .stream()
                .map(UserResponse::from)
                .filter(u -> u.getRole() != null) // Filter out users without roles
                .collect(Collectors.toList());

        Map<String, Long> countByRole = allUsers.stream()
                .collect(Collectors.groupingBy(
                        u -> u.getRole().name(),
                        Collectors.counting()
                ));

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", (long) allUsers.size());
        stats.put("byRole", countByRole);
        stats.put("users", allUsers);

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    /**
     * GET /admin/traffic — Returns real-time traffic metrics.
     */
    @GetMapping("/traffic")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTrafficStats() {
        Map<String, Object> topEndpoint = trafficService.getTopEndpoint();

        Map<String, Object> result = new HashMap<>();
        result.put("totalRequestsToday",  trafficService.getTotalRequestsToday());
        result.put("requestsLastMinute",  trafficService.getRequestsLastMinute());
        result.put("activeSessions",      trafficService.getActiveSessions());
        result.put("topEndpoint",         topEndpoint.get("path"));
        result.put("topEndpointCount",    topEndpoint.get("count"));
        result.put("endpointStats",       trafficService.getEndpointStats());

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    /**
     * GET /admin/dashboard — Returns comprehensive dashboard statistics.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboardStats()));
    }
}
