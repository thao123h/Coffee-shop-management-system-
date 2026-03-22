package com.coffeeshop.management.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PayOSConfig {
    @Value("${payos.client-id}")
    public String clientId;

    @Value("${payos.api-key}")
    public String apiKey;

    @Value("${payos.checksum-key}")
    public String checksumKey;
}