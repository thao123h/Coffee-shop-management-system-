package com.coffeeshop.management.service;

import com.coffeeshop.management.dto.response.ProductVariantResponse;
import com.coffeeshop.management.entity.ProductVariant;
import com.coffeeshop.management.mapper.ProductVariantMapper;
import com.coffeeshop.management.repository.ProductRepository;
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
    private final ProductVariantMapper productVariantMapper;

    public List<ProductVariant> findAll() {
        return productVariantRepository.findAll();
    }


    public List<ProductVariantResponse> findProductVariantsByProductId(Long productId) {
        List<ProductVariant>  list = productVariantRepository.findByProductId(productId);
        return productVariantMapper.toResponseList(list);
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

    @Transactional
    public void deleteByProductId(Long productId) {
        productVariantRepository.deleteByProductId(productId);
    }
}
