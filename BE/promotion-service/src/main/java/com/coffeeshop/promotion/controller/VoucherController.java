package com.coffeeshop.promotion.controller;

import com.coffeeshop.promotion.dto.VoucherRequest;
import com.coffeeshop.promotion.entity.Voucher;
import com.coffeeshop.promotion.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @GetMapping
    public ResponseEntity<List<Voucher>> getAll() {
        return ResponseEntity.ok(voucherService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Voucher> getById(@PathVariable Long id) {
        return ResponseEntity.ok(voucherService.getById(id));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<Voucher> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(voucherService.getByCode(code));
    }

    @PostMapping
    public ResponseEntity<Voucher> create(@Valid @RequestBody VoucherRequest req) {
        return ResponseEntity.ok(voucherService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Voucher> update(@PathVariable Long id, @Valid @RequestBody VoucherRequest req) {
        return ResponseEntity.ok(voucherService.update(id, req));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Void> toggle(@PathVariable Long id) {
        voucherService.toggleActive(id);
        return ResponseEntity.noContent().build();
    }
}
