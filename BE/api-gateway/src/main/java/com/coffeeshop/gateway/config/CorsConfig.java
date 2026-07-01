package com.coffeeshop.gateway.config;

import org.springframework.context.annotation.Configuration;

/**
 * CORS is handled via spring.cloud.gateway.globalcors in application.yml.
 * Do NOT add a CorsWebFilter bean here — it conflicts with Gateway's built-in CORS handling.
 */
@Configuration
public class CorsConfig {
    // intentionally empty
}
