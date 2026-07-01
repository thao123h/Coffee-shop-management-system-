package com.coffeeshop.menu.service;

import com.coffeeshop.menu.dto.ProductVariantRequest;
import com.coffeeshop.menu.dto.VariantSnapshotDto;
import com.coffeeshop.menu.entity.Product;
import com.coffeeshop.menu.entity.ProductVariant;
import com.coffeeshop.menu.repository.ProductRepository;
import com.coffeeshop.menu.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductVariantService {

    private final ProductVariantRepository variantRepository;
    private final ProductRepository productRepository;

    public ProductVariant getById(Long id) {
        return variantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variant not found: " + id));
    }

    public VariantSnapshotDto getSnapshot(Long id) {
        ProductVariant v = getById(id);
        return new VariantSnapshotDto(
                v.getId(),
                v.getProduct().getName(),
                v.getName(),
                v.getPrice(),
                v.getIsActive()
        );
    }

    public List<VariantSnapshotDto> getBatchSnapshots(List<Long> ids) {
        return variantRepository.findByIdIn(ids).stream()
                .map(v -> new VariantSnapshotDto(
                        v.getId(),
                        v.getProduct().getName(),
                        v.getName(),
                        v.getPrice(),
                        v.getIsActive()))
                .toList();
    }

    public List<ProductVariant> getByProductId(Long productId) {
        return variantRepository.findByProductIdAndIsActiveTrue(productId);
    }

    public ProductVariant create(ProductVariantRequest req) {
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + req.getProductId()));
        ProductVariant v = ProductVariant.builder()
                .product(product)
                .name(req.getName())
                .price(req.getPrice())
                .skuCode(req.getSkuCode())
                .isActive(true)
                .build();
        return variantRepository.save(v);
    }

    public ProductVariant update(Long id, ProductVariantRequest req) {
        ProductVariant v = getById(id);
        v.setName(req.getName());
        v.setPrice(req.getPrice());
        v.setSkuCode(req.getSkuCode());
        return variantRepository.save(v);
    }

    public void delete(Long id) {
        ProductVariant v = getById(id);
        v.setIsActive(false);
        variantRepository.save(v);
    }
}
