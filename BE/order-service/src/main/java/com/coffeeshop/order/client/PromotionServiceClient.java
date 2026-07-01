package com.coffeeshop.order.client;

import com.coffeeshop.order.client.config.FeignClientConfig;
import com.coffeeshop.order.client.dto.VoucherApplyRequest;
import com.coffeeshop.order.client.dto.VoucherValidateRequest;
import com.coffeeshop.order.client.dto.VoucherValidateResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
    name = "promotion-service",
    url  = "${services.promotion.url}",
    configuration = FeignClientConfig.class
)
public interface PromotionServiceClient {

    @PostMapping("/internal/vouchers/{code}/validate")
    VoucherValidateResponse validateVoucher(
            @PathVariable("code") String code,
            @RequestBody VoucherValidateRequest req
    );

    @PostMapping("/internal/vouchers/{code}/apply")
    void applyVoucher(
            @PathVariable("code") String code,
            @RequestBody VoucherApplyRequest req
    );
}
