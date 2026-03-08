package com.coffeeshop.management.controller;

import com.coffeeshop.management.dto.request.VoucherRequest;
import com.coffeeshop.management.dto.response.ApiResponse;
import com.coffeeshop.management.entity.Voucher;
import com.coffeeshop.management.enums.ErrorCode;
import com.coffeeshop.management.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Voucher>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String keyword) {
        Page<Voucher> result = voucherService.findAll(page, size, keyword);
        return ResponseEntity.ok(ApiResponse.success(result));
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
    public ResponseEntity<ApiResponse<Voucher>> create(@Valid @RequestBody VoucherRequest request) {
        Voucher saved = voucherService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Voucher>> update(@PathVariable Long id, @Valid @RequestBody VoucherRequest request) {
        if (!voucherService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ErrorCode.NOT_FOUND));
        }
        Voucher updated = voucherService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<Voucher>> toggleActive(@PathVariable Long id) {
        if (!voucherService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ErrorCode.NOT_FOUND));
        }
        Voucher toggled = voucherService.toggleActive(id);
        return ResponseEntity.ok(ApiResponse.success(toggled));
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
