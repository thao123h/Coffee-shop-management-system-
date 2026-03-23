package com.coffeeshop.management.service;

import org.apache.hc.client5.http.utils.Hex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import com.coffeeshop.management.config.PayOSConfig;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PayOSService {

    @Autowired
    private PayOSConfig config;

    public String createPaymentLink(Long orderId, int amount) {
        String endpoint = "https://api-merchant.payos.vn/v2/payment-requests";

        Map<String, Object> body = new HashMap<>();
        body.put("orderCode", orderId);
        body.put("amount", amount);
        body.put("description", "Thanh toan don hang #" + orderId);
        body.put("returnUrl", "http://localhost:3000/success");
        body.put("cancelUrl", "http://localhost:3000/cancel");

        // TODO: generate signature
        String signature = generateSignature(body);

        body.put("signature", signature);

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-client-id", config.clientId);
        headers.set("x-api-key", config.apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(endpoint, request, Map.class);

        System.out.println("PAYOS RESPONSE: " + response.getBody());

        Map responseBody = response.getBody();

        if (responseBody == null || responseBody.get("data") == null) {
            throw new RuntimeException("PayOS error: " + responseBody);
        }
        Map data = (Map) response.getBody().get("data");
        return (String) data.get("checkoutUrl");
    }
    public String generateSignature(Map<String, Object> data) {
        try {
            String rawData = buildRawData(data);
            System.out.println("DATA TO SIGN: " + rawData);

            String secretKey = config.checksumKey; //

            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);

            byte[] hash = mac.doFinal(rawData.getBytes());

            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }

            return hex.toString();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    private String buildRawData(Map<String, Object> data) {
        List<String> keys = Arrays.asList(
                "amount",
                "cancelUrl",
                "description",
                "orderCode",
                "returnUrl"
        );

        return keys.stream()
                .map(key -> key + "=" + data.get(key))
                .collect(Collectors.joining("&"));
    }
}