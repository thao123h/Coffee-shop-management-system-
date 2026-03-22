package com.coffeeshop.management.controller;

import com.coffeeshop.management.dto.request.ToppingRequest;
import com.coffeeshop.management.dto.response.ApiResponse;
import com.coffeeshop.management.dto.response.ToppingResponse;
import com.coffeeshop.management.entity.Topping;
import com.coffeeshop.management.enums.ErrorCode;
import com.coffeeshop.management.service.ToppingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/toppings")
@RequiredArgsConstructor
public class ToppingController {

    private final ToppingService toppingService;


    /** GET /toppings — Lấy tất cả topping */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ToppingResponse>>> getAllToppings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "false") boolean activeOnly) {
        Page<ToppingResponse> responses = toppingService.findAll(page, size, keyword, activeOnly)
                .map(ToppingResponse::from);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    /** GET /toppings/active — Chỉ topping đang bán */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<ToppingResponse>>> getActiveToppings() {
        List<ToppingResponse> list = toppingService.findAllActive()
                .stream().map(ToppingResponse::from).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    /** GET /toppings/{id} — Chi tiết một topping */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ToppingResponse>> getToppingById(@PathVariable Long id) {
        return toppingService.findById(id)
                .map(t -> ResponseEntity.ok(ApiResponse.success(ToppingResponse.from(t))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.<ToppingResponse>error(ErrorCode.NOT_FOUND)));
    }

    /** POST /toppings — Tạo topping mới */
    @PostMapping
    public ResponseEntity<ApiResponse<ToppingResponse>> createTopping(@Valid @RequestBody ToppingRequest request) {
        Topping topping = Topping.builder()
                .name(request.getName())
                .price(request.getPrice())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
        Topping saved = toppingService.save(topping);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(ToppingResponse.from(saved)));
    }

    /** PUT /toppings/{id} — Cập nhật topping */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ToppingResponse>> updateTopping(
            @PathVariable Long id,
            @Valid @RequestBody ToppingRequest request) {
        return toppingService.findById(id).map(topping -> {
            topping.setName(request.getName());
            topping.setPrice(request.getPrice());
            if (request.getIsActive() != null) topping.setIsActive(request.getIsActive());
            return ResponseEntity.ok(ApiResponse.success(ToppingResponse.from(toppingService.save(topping))));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.<ToppingResponse>error(ErrorCode.NOT_FOUND)));
    }

    /** PATCH /toppings/{id}/toggle-active — Bật/tắt trạng thái */
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<ToppingResponse>> toggleActive(@PathVariable Long id) {
        return toppingService.findById(id).map(topping -> {
            topping.setIsActive(!topping.getIsActive());
            return ResponseEntity.ok(ApiResponse.success(ToppingResponse.from(toppingService.save(topping))));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.<ToppingResponse>error(ErrorCode.NOT_FOUND)));
    }

    /** DELETE /toppings/{id} — Xóa topping */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTopping(@PathVariable Long id) {
        if (!toppingService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<Void>error(ErrorCode.NOT_FOUND));
        }
        toppingService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

}
