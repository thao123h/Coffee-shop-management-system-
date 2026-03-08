package com.coffeeshop.management.mapper;

import com.coffeeshop.management.entity.ProductVariant;
import com.coffeeshop.management.dto.response.ProductVariantResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductVariantMapper {

    ProductVariantResponse toResponse(ProductVariant variant);

    List<ProductVariantResponse> toResponseList(List<ProductVariant> variants);

}