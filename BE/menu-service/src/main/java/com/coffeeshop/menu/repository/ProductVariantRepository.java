package com.coffeeshop.menu.repository;

import com.coffeeshop.menu.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProductIdAndIsActiveTrue(Long productId);
    List<ProductVariant> findByIdIn(List<Long> ids);
}
