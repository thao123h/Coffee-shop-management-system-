package com.coffeeshop.payment.config;

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

    @Value("${payos.return-url}")
    public String returnUrl;

    @Value("${payos.cancel-url}")
    public String cancelUrl;
}
