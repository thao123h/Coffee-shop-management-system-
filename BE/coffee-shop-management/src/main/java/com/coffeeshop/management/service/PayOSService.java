package com.coffeeshop.management.service;

import com.coffeeshop.management.config.PayOSConfig;
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

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

            SecretKeySpec secretKey = new SecretKeySpec(
                    config.checksumKey.getBytes(),
                    "HmacSHA256"
            );

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(secretKey);

            byte[] hash = mac.doFinal(rawData.getBytes());
            return Hex.encodeHexString(hash);

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