package com.coffeeshop.order.client;

import com.coffeeshop.order.client.config.FeignClientConfig;
import com.coffeeshop.order.client.dto.CreatePaymentRequest;
import com.coffeeshop.order.client.dto.PaymentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
    name = "payment-service",
    url  = "${services.payment.url}",
    configuration = FeignClientConfig.class
)
public interface PaymentServiceClient {

    @PostMapping("/internal/payments/create")
    PaymentResponse createPayment(@RequestBody CreatePaymentRequest req);
}
