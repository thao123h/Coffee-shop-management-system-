package com.coffeeshop.management.mapper;

import com.coffeeshop.management.dto.response.OrderItemResponse;
import com.coffeeshop.management.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {

    @Mapping(target = "toppings", ignore = true)
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);
}
