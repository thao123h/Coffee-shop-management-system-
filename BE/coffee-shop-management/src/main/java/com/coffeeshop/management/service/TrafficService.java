package com.coffeeshop.management.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * In-memory traffic tracking service.
 * Counts total requests today, per-endpoint, and per minute.
 */
@Service
public class TrafficService {

    // Total requests today
    private final AtomicLong totalRequestsToday = new AtomicLong(0);

    // Active "sessions" – incremented on login, decremented on logout (simplified: just tracks users with tokens)
    private final AtomicLong activeSessions = new AtomicLong(0);

    // Per-endpoint stats: "METHOD /path" -> count
    private final ConcurrentHashMap<String, AtomicLong> endpointCounts = new ConcurrentHashMap<>();

    // Last-minute sliding window (simple: count in last 60 seconds)
    private final List<Long> requestTimestamps = new ArrayList<>();

    // Current date for daily reset
    private volatile LocalDate currentDate = LocalDate.now();

    public synchronized void recordRequest(String method, String path) {
        // Reset daily counter if date changed
        LocalDate today = LocalDate.now();
        if (!today.equals(currentDate)) {
            totalRequestsToday.set(0);
            endpointCounts.clear();
            currentDate = today;
        }

        totalRequestsToday.incrementAndGet();

        String key = method.toUpperCase() + " " + normalizePath(path);
        endpointCounts.computeIfAbsent(key, k -> new AtomicLong(0)).incrementAndGet();

        // Track timestamps for per-minute calculation
        long now = System.currentTimeMillis();
        requestTimestamps.add(now);
        // Remove timestamps older than 60 seconds
        requestTimestamps.removeIf(ts -> now - ts > 60_000);
    }

    public void incrementSessions()  { activeSessions.incrementAndGet(); }
    public void decrementSessions()  { if (activeSessions.get() > 0) activeSessions.decrementAndGet(); }

    public long getTotalRequestsToday() { return totalRequestsToday.get(); }

    public synchronized long getRequestsLastMinute() { return requestTimestamps.size(); }

    public long getActiveSessions() { return activeSessions.get(); }

    public List<Map<String, Object>> getEndpointStats() {
        List<Map<String, Object>> results = new ArrayList<>();
        endpointCounts.forEach((key, count) -> {
            String[] parts = key.split(" ", 2);
            results.add(Map.of(
                "method", parts.length > 0 ? parts[0] : "?",
                "path",   parts.length > 1 ? parts[1] : key,
                "count",  count.get()
            ));
        });
        results.sort((a, b) -> Long.compare((long) b.get("count"), (long) a.get("count")));
        return results;
    }

    public Map<String, Object> getTopEndpoint() {
        return endpointCounts.entrySet().stream()
            .max(Map.Entry.comparingByValue((a, b) -> Long.compare(a.get(), b.get())))
            .map(entry -> {
                String[] parts = entry.getKey().split(" ", 2);
                return Map.<String, Object>of(
                    "path",  parts.length > 1 ? parts[1] : entry.getKey(),
                    "count", entry.getValue().get()
                );
            })
            .orElse(Map.of("path", "—", "count", 0L));
    }

    private String normalizePath(String path) {
        // Replace numeric segments with {id} for grouping
        return path.replaceAll("/\\d+", "/{id}");
    }
}
