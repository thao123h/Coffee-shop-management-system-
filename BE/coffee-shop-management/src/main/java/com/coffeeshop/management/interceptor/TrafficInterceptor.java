package com.coffeeshop.management.interceptor;

import com.coffeeshop.management.service.TrafficService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Records every incoming HTTP request into TrafficService for analytics.
 */
@Component
public class TrafficInterceptor implements HandlerInterceptor {

    @Autowired
    private TrafficService trafficService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String method = request.getMethod();
        String path   = request.getRequestURI();
        // Skip static/health/swagger endpoints from counts
        if (!path.startsWith("/swagger") && !path.startsWith("/v3/api-docs") && !path.equals("/error")) {
            trafficService.recordRequest(method, path);
        }
        return true;
    }
}
