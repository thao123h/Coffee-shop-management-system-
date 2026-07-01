package com.coffeeshop.menu.controller;

import com.coffeeshop.menu.dto.ToppingSnapshotDto;
import com.coffeeshop.menu.dto.VariantSnapshotDto;
import com.coffeeshop.menu.service.ProductVariantService;
import com.coffeeshop.menu.service.ToppingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Internal endpoints called only by other microservices via Feign Client.
 * Protected by X-Internal-Service-Token header — NOT exposed through API Gateway.
 */
@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
public class InternalMenuController {

    @Value("${internal.service-token}")
    private String serviceToken;

    private final ProductVariantService variantService;
    private final ToppingService toppingService;

    @GetMapping("/variants/{id}")
    public ResponseEntity<VariantSnapshotDto> getVariantSnapshot(
            @PathVariable Long id,
            @RequestHeader("X-Internal-Service-Token") String token) {
        validateToken(token);
        return ResponseEntity.ok(variantService.getSnapshot(id));
    }

    @PostMapping("/variants/batch")
    public ResponseEntity<List<VariantSnapshotDto>> getBatchVariants(
            @RequestBody List<Long> ids,
            @RequestHeader("X-Internal-Service-Token") String token) {
        validateToken(token);
        return ResponseEntity.ok(variantService.getBatchSnapshots(ids));
    }

    @GetMapping("/toppings/{id}")
    public ResponseEntity<ToppingSnapshotDto> getToppingSnapshot(
            @PathVariable Long id,
            @RequestHeader("X-Internal-Service-Token") String token) {
        validateToken(token);
        return ResponseEntity.ok(toppingService.getSnapshot(id));
    }

    @PostMapping("/toppings/batch")
    public ResponseEntity<List<ToppingSnapshotDto>> getBatchToppings(
            @RequestBody List<Long> ids,
            @RequestHeader("X-Internal-Service-Token") String token) {
        validateToken(token);
        return ResponseEntity.ok(toppingService.getBatchSnapshots(ids));
    }

    private void validateToken(String token) {
        if (!serviceToken.equals(token)) {
            throw new SecurityException("Invalid internal service token");
        }
    }
}
