package com.coffeeshop.menu.controller;

import com.coffeeshop.menu.dto.ApiResponse;
import com.coffeeshop.menu.dto.CategoryRequest;
import com.coffeeshop.menu.entity.Category;
import com.coffeeshop.menu.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /** Paginated list with keyword search — used by FE category management page */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Category>>> getAll(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "")   String keyword) {
        Page<Category> result = categoryService.getPage(page, size, keyword);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    /** Simple list for dropdowns (no pagination) */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Category>>> getAllSimple() {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getActive()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Category>> create(@Valid @RequestBody CategoryRequest req) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.create(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> update(
            @PathVariable Long id, @Valid @RequestBody CategoryRequest req) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.update(id, req)));
    }

    /** Toggle active/inactive — FE calls PATCH /{id}/toggle-active */
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<Category>> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.toggleActive(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
