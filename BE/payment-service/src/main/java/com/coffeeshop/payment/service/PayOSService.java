package com.coffeeshop.payment.service;

import com.coffeeshop.payment.config.PayOSConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayOSService {

    private final PayOSConfig config;

    public String createPaymentLink(Long orderId, int amount, String description) {
        String endpoint = "https://api-merchant.payos.vn/v2/payment-requests";

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("orderCode", orderId);
        body.put("amount", amount);
        body.put("description", description != null ? description : "Thanh toan don hang #" + orderId);
        body.put("returnUrl", config.returnUrl);
        body.put("cancelUrl", config.cancelUrl);

        String signature = generateSignature(body);
        body.put("signature", signature);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-client-id", config.clientId);
        headers.set("x-api-key", config.apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(endpoint, request, Map.class);
            Map responseBody = response.getBody();
            if (responseBody == null || responseBody.get("data") == null) {
                throw new RuntimeException("PayOS error: " + responseBody);
            }
            Map data = (Map) responseBody.get("data");
            return (String) data.get("checkoutUrl");
        } catch (Exception e) {
            log.error("PayOS createPaymentLink failed for orderId={}: {}", orderId, e.getMessage());
            throw new RuntimeException("Failed to create PayOS payment link", e);
        }
    }

    public String generateSignature(Map<String, Object> data) {
        try {
            List<String> keys = Arrays.asList("amount", "cancelUrl", "description", "orderCode", "returnUrl");
            String rawData = keys.stream()
                    .filter(data::containsKey)
                    .map(k -> k + "=" + data.get(k))
                    .collect(Collectors.joining("&"));

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(config.checksumKey.getBytes(), "HmacSHA256"));
            byte[] hash = mac.doFinal(rawData.getBytes());

            StringBuilder hex = new StringBuilder();
            for (byte b : hash) hex.append(String.format("%02x", b));
            return hex.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PayOS signature", e);
        }
    }
}
