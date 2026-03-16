package com.coffeeshop.management.service;

import com.coffeeshop.management.dto.response.ToppingResponse;
import com.coffeeshop.management.entity.OrderItem;
import com.coffeeshop.management.entity.OrderItemTopping;
import com.coffeeshop.management.entity.Topping;
import com.coffeeshop.management.mapper.ToppingMapper;
import com.coffeeshop.management.repository.OrderItemToppingRepository;
import com.coffeeshop.management.repository.ToppingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderItemToppingService {
    private final ToppingRepository toppingRepository;
    private final ToppingMapper toppingMapper;

    private final OrderItemToppingRepository orderItemToppingRepository;

    public List<OrderItemTopping> findByOrderItemId(Long orderItemId) {
        return orderItemToppingRepository.findByOrderItemId(orderItemId);
    }

    public Optional<OrderItemTopping> findById(Long id) {
        return orderItemToppingRepository.findById(id);
    }


    public OrderItemTopping save(Long toppingId, OrderItem orderItem) {
        OrderItemTopping orderItemTopping = new OrderItemTopping();
        orderItemTopping.setOrderItem(orderItem);
        Topping topping = toppingRepository.findById(toppingId).get();
        orderItemTopping.setTopping(topping);
        orderItemTopping.setToppingName(topping.getName());
        orderItemTopping.setPrice(topping.getPrice());
        return  orderItemToppingRepository.save(orderItemTopping);

    }

    public List<ToppingResponse> findToppingResponseByOrderItemId(Long orderItemId) {
        List<OrderItemTopping> orderItemToppings = orderItemToppingRepository.findByOrderItemId(orderItemId);
        List<ToppingResponse> toppingResponses = new ArrayList<>();
        for (OrderItemTopping orderItemTopping : orderItemToppings) {
            ToppingResponse toppingResponse = toppingMapper.toToppingResponse(orderItemTopping);
            toppingResponses.add(toppingResponse);
        }
        return toppingResponses;
    }

    @Transactional
    public void deleteById(Long id) {
        orderItemToppingRepository.deleteById(id);
    }
}
