package com.coffeeshop.menu.service;

import com.coffeeshop.menu.dto.CategoryRequest;
import com.coffeeshop.menu.entity.Category;
import com.coffeeshop.menu.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAll()   { return categoryRepository.findAll(); }
    public List<Category> getActive(){ return categoryRepository.findByIsActiveTrue(); }

    public Page<Category> getPage(int page, int size, String keyword) {
        PageRequest pageable = PageRequest.of(page, size);
        if (keyword != null && !keyword.isBlank()) {
            return categoryRepository.findByNameContainingIgnoreCase(keyword, pageable);
        }
        return categoryRepository.findAll(pageable);
    }

    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found: " + id));
    }

    public Category create(CategoryRequest req) {
        Category cat = Category.builder()
                .name(req.getName())
                .description(req.getDescription())
                .isActive(true)
                .build();
        return categoryRepository.save(cat);
    }

    public Category update(Long id, CategoryRequest req) {
        Category cat = getById(id);
        cat.setName(req.getName());
        cat.setDescription(req.getDescription());
        return categoryRepository.save(cat);
    }

    public Category toggleActive(Long id) {
        Category cat = getById(id);
        cat.setIsActive(!cat.getIsActive());
        return categoryRepository.save(cat);
    }

    public void delete(Long id) {
        Category cat = getById(id);
        cat.setIsActive(false);
        categoryRepository.save(cat);
    }
}
