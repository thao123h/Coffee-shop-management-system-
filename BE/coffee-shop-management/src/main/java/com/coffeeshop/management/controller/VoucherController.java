package com.coffeeshop.management.controller;

import com.coffeeshop.management.dto.response.ApiResponse;
import com.coffeeshop.management.entity.Voucher;
import com.coffeeshop.management.enums.ErrorCode;
import com.coffeeshop.management.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Voucher>>> getAll(@RequestParam(required = false) Boolean activeOnly) {
        List<Voucher> list = Boolean.TRUE.equals(activeOnly)
                ? voucherService.findAllActive()
                : voucherService.findAll();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Voucher>> getById(@PathVariable Long id) {
        return voucherService.findById(id)
                .map(v -> ResponseEntity.ok(ApiResponse.success(v)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ErrorCode.NOT_FOUND)));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<Voucher>> getByCode(@PathVariable String code) {
        return voucherService.findByCode(code)
                .map(v -> ResponseEntity.ok(ApiResponse.success(v)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ErrorCode.NOT_FOUND)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Voucher>> create(@Valid @RequestBody Voucher voucher) {
        Voucher saved = voucherService.save(voucher);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Voucher>> update(@PathVariable Long id, @Valid @RequestBody Voucher voucher) {
        if (!voucherService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ErrorCode.NOT_FOUND));
        }
        voucher.setId(id);
        Voucher updated = voucherService.save(voucher);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        if (!voucherService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ErrorCode.NOT_FOUND));
        }
        voucherService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
