package com.coffeeshop.order.client;

import com.coffeeshop.order.client.config.FeignClientConfig;
import com.coffeeshop.order.client.dto.ToppingSnapshotDto;
import com.coffeeshop.order.client.dto.VariantSnapshotDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(
    name = "menu-service",
    url  = "${services.menu.url}",
    configuration = FeignClientConfig.class
)
public interface MenuServiceClient {

    @GetMapping("/internal/variants/{id}")
    VariantSnapshotDto getVariant(@PathVariable("id") Long id);

    @PostMapping("/internal/variants/batch")
    List<VariantSnapshotDto> getBatchVariants(@RequestBody List<Long> ids);

    @GetMapping("/internal/toppings/{id}")
    ToppingSnapshotDto getTopping(@PathVariable("id") Long id);

    @PostMapping("/internal/toppings/batch")
    List<ToppingSnapshotDto> getBatchToppings(@RequestBody List<Long> ids);
}
