package com.coffeeshop.management.service;

import com.coffeeshop.management.dto.request.OrderItemRequest;
import com.coffeeshop.management.dto.response.OrderItemResponse;
import com.coffeeshop.management.entity.Order;
import com.coffeeshop.management.entity.OrderItem;
import com.coffeeshop.management.entity.ProductVariant;
import com.coffeeshop.management.mapper.OrderItemMapper;
import com.coffeeshop.management.repository.OrderItemRepository;
import com.coffeeshop.management.repository.ProductRepository;
import com.coffeeshop.management.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderItemService {
    private final ProductVariantRepository productVariantRepository;

    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantService productVariantService;
    private final OrderItemMapper orderItemMapper;

    public List<OrderItem> findByOrderId(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    public Optional<OrderItem> findById(Long id) {
        return orderItemRepository.findById(id);
    }


    public OrderItem save(OrderItemRequest orderItemRequest, Order order) {
        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        ProductVariant productVariant = productVariantRepository.findById(orderItemRequest.getProductVariantId()).get();
        orderItem.setProductVariant(productVariant);
        orderItem.setQuantity(orderItemRequest.getQuantity());
        orderItem.setUnitPrice(productVariant.getPrice());
        orderItem.setNote(orderItemRequest.getNote());
        orderItem.setVariantName(productVariant.getName());
        orderItem.setProductName(productVariant.getProduct().getName());
        return orderItemRepository.save(orderItem);

    }

    @Transactional
    public void deleteById(Long id) {
        orderItemRepository.deleteById(id);
    }
}
