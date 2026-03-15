package com.coffeeshop.management.controller;

import com.coffeeshop.management.dto.response.ApiResponse;
import com.coffeeshop.management.entity.Category;
import com.coffeeshop.management.enums.ErrorCode;
import com.coffeeshop.management.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAll(@RequestParam(required = false) Boolean activeOnly) {
        List<Category> list = Boolean.TRUE.equals(activeOnly)
                ? categoryService.findAllActive()
                : categoryService.findAll();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getById(@PathVariable Long id) {
        return categoryService.findById(id)
                .map(c -> ResponseEntity.ok(ApiResponse.success(c)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ErrorCode.NOT_FOUND)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Category>> create(@Valid @RequestBody Category category) {
        Category saved = categoryService.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        if (!categoryService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ErrorCode.NOT_FOUND));
        }
        categoryService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> update(
            @PathVariable Long id,
            @Valid @RequestBody Category categoryRequest) {
        return categoryService.findById(id).map(existing -> {
            existing.setName(categoryRequest.getName());
            existing.setDescription(categoryRequest.getDescription());
            if (categoryRequest.getIsActive() != null) {
                existing.setIsActive(categoryRequest.getIsActive());
            }
            if (categoryRequest.getCode() != null) {
                existing.setCode(categoryRequest.getCode());
            }
            if (categoryRequest.getDisplayOrder() != null) {
                existing.setDisplayOrder(categoryRequest.getDisplayOrder());
            }
            Category updated = categoryService.save(existing);
            return ResponseEntity.ok(ApiResponse.success(updated));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ErrorCode.NOT_FOUND)));
    }
}
