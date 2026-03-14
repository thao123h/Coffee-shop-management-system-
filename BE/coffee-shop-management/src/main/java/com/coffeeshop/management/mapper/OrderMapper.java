package com.coffeeshop.management.mapper;

import com.coffeeshop.management.dto.response.OrderResponse;
import com.coffeeshop.management.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(source = "staff.username", target = "staffName")
    @Mapping(source = "voucher.code", target = "voucherCode")
    @Mapping(target = "orderItems",ignore = true)
    OrderResponse toOrderResponse(Order order);
}
