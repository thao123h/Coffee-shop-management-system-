package com.coffeeshop.management.service;

import com.coffeeshop.management.entity.OrderItemTopping;
import com.coffeeshop.management.repository.OrderItemToppingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderItemToppingService {

    private final OrderItemToppingRepository orderItemToppingRepository;

    public List<OrderItemTopping> findByOrderItemId(Long orderItemId) {
        return orderItemToppingRepository.findByOrderItemId(orderItemId);
    }

    public Optional<OrderItemTopping> findById(Long id) {
        return orderItemToppingRepository.findById(id);
    }

    @Transactional
    public OrderItemTopping save(OrderItemTopping orderItemTopping) {
        return orderItemToppingRepository.save(orderItemTopping);
    }

    @Transactional
    public void deleteById(Long id) {
        orderItemToppingRepository.deleteById(id);
    }
}
