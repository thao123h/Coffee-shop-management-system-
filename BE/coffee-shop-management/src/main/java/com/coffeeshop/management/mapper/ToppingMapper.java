package com.coffeeshop.management.mapper;

import com.coffeeshop.management.dto.response.OrderResponse;
import com.coffeeshop.management.dto.response.ToppingResponse;
import com.coffeeshop.management.entity.Order;
import com.coffeeshop.management.entity.OrderItemTopping;
import com.coffeeshop.management.entity.Topping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ToppingMapper {
    @Mapping(source = "toppingName", target = "name")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    ToppingResponse toToppingResponse(OrderItemTopping orderItemTopping);
}
