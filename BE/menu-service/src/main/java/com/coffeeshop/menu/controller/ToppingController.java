package com.coffeeshop.menu.controller;

import com.coffeeshop.menu.dto.ApiResponse;
import com.coffeeshop.menu.dto.ToppingRequest;
import com.coffeeshop.menu.entity.Topping;
import com.coffeeshop.menu.service.ToppingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/toppings")
@RequiredArgsConstructor
public class ToppingController {

    private final ToppingService toppingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Topping>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(toppingService.getAll()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Topping>>> getActive() {
        return ResponseEntity.ok(ApiResponse.success(toppingService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Topping>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(toppingService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Topping>> create(@Valid @RequestBody ToppingRequest req) {
        return ResponseEntity.ok(ApiResponse.success(toppingService.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Topping>> update(
            @PathVariable Long id, @Valid @RequestBody ToppingRequest req) {
        return ResponseEntity.ok(ApiResponse.success(toppingService.update(id, req)));
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<Topping>> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(toppingService.toggleActive(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        toppingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
