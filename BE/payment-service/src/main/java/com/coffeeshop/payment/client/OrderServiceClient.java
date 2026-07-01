package com.coffeeshop.payment.client;

import com.coffeeshop.payment.client.config.FeignClientConfig;
import com.coffeeshop.payment.client.dto.UpdateStatusRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
    name = "order-service",
    url  = "${services.order.url}",
    configuration = FeignClientConfig.class
)
public interface OrderServiceClient {

    @PatchMapping("/internal/orders/{id}/status")
    void updateOrderStatus(
            @PathVariable("id") Long orderId,
            @RequestBody UpdateStatusRequest req
    );
}
