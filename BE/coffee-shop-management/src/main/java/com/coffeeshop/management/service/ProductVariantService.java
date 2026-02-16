package com.coffeeshop.management.service;

import com.coffeeshop.management.entity.ProductVariant;
import com.coffeeshop.management.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductVariantService {

    private final ProductVariantRepository productVariantRepository;

    public List<ProductVariant> findAll() {
        return productVariantRepository.findAll();
    }

    public List<ProductVariant> findByProductId(Long productId) {
        return productVariantRepository.findByProductIdAndIsActiveTrue(productId);
    }

    public Optional<ProductVariant> findById(Long id) {
        return productVariantRepository.findById(id);
    }

    @Transactional
    public ProductVariant save(ProductVariant productVariant) {
        return productVariantRepository.save(productVariant);
    }

    @Transactional
    public void deleteById(Long id) {
        productVariantRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return productVariantRepository.existsById(id);
    }
}
