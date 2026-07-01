package com.coffeeshop.menu.service;

import com.coffeeshop.menu.dto.ProductRequest;
import com.coffeeshop.menu.entity.Category;
import com.coffeeshop.menu.entity.Product;
import com.coffeeshop.menu.repository.CategoryRepository;
import com.coffeeshop.menu.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<Product> getPage(int page, int size, String keyword, boolean activeOnly) {
        return productRepository.filterProducts(
                (keyword == null || keyword.isBlank()) ? null : keyword,
                activeOnly,
                PageRequest.of(page, size)
        );
    }

    public List<Product> getAll()   { return productRepository.findByIsActiveTrue(); }

    public List<Product> getByCategoryId(Long categoryId) {
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId);
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }

    public Product create(ProductRequest req) {
        Category cat = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found: " + req.getCategoryId()));
        Product p = Product.builder()
                .category(cat)
                .name(req.getName())
                .description(req.getDescription())
                .imageUrl(req.getImageUrl())
                .isActive(true)
                .build();
        return productRepository.save(p);
    }

    public Product update(Long id, ProductRequest req) {
        Product p = getById(id);
        if (req.getCategoryId() != null) {
            Category cat = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            p.setCategory(cat);
        }
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setImageUrl(req.getImageUrl());
        return productRepository.save(p);
    }

    public Product toggleActive(Long id) {
        Product p = getById(id);
        p.setIsActive(!p.getIsActive());
        return productRepository.save(p);
    }

    public void delete(Long id) {
        Product p = getById(id);
        p.setIsActive(false);
        productRepository.save(p);
    }
}
