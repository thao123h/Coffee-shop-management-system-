package com.coffeeshop.management.service;

import com.coffeeshop.management.entity.Category;
import com.coffeeshop.management.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Page<Category> findAll(int page, int size, String keyword, boolean activeOnly) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        if (activeOnly) {
            return categoryRepository.findByNameContainingIgnoreCaseAndIsActiveTrueOrderByDisplayOrderAsc(keyword != null ? keyword : "", pageable);
        }
        return categoryRepository.findAllByNameContainingIgnoreCase(keyword, pageable);
    }

    public List<Category> findAllActive() {
        return categoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    @Transactional
    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteById(Long id) {
        categoryRepository.findById(id).ifPresent(c -> {
            c.setIsActive(false);
            categoryRepository.save(c);
        });
    }

    public boolean existsById(Long id) {
        return categoryRepository.existsById(id);
    }
}
