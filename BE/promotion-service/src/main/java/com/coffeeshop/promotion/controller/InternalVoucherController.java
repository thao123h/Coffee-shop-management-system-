package com.coffeeshop.promotion.controller;

import com.coffeeshop.promotion.dto.VoucherApplyRequest;
import com.coffeeshop.promotion.dto.VoucherValidateRequest;
import com.coffeeshop.promotion.dto.VoucherValidateResponse;
import com.coffeeshop.promotion.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Internal endpoints called only by Order Service via Feign Client.
 */
@RestController
@RequestMapping("/internal/vouchers")
@RequiredArgsConstructor
public class InternalVoucherController {

    @Value("${internal.service-token}")
    private String serviceToken;

    private final VoucherService voucherService;

    @PostMapping("/{code}/validate")
    public ResponseEntity<VoucherValidateResponse> validate(
            @PathVariable String code,
            @RequestBody VoucherValidateRequest req,
            @RequestHeader("X-Internal-Service-Token") String token) {
        validateToken(token);
        return ResponseEntity.ok(voucherService.validate(code, req));
    }

    @PostMapping("/{code}/apply")
    public ResponseEntity<Void> apply(
            @PathVariable String code,
            @RequestBody VoucherApplyRequest req,
            @RequestHeader("X-Internal-Service-Token") String token) {
        validateToken(token);
        voucherService.apply(code, req);
        return ResponseEntity.noContent().build();
    }

    private void validateToken(String token) {
        if (!serviceToken.equals(token)) {
            throw new SecurityException("Invalid internal service token");
        }
    }
}
