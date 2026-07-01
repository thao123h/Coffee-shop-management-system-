package com.coffeeshop.menu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductRequest {
    @NotNull
    private Long categoryId;
    @NotBlank
    private String name;
    private String description;
    private String imageUrl;
}
