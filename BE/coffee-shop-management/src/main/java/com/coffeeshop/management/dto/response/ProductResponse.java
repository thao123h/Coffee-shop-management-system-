package com.coffeeshop.management.dto.response;

import com.coffeeshop.management.entity.Product;
import lombok.Data;

@Data
public class ProductResponse {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String description;
    private String imageUrl;
    private Boolean hasMultipleSizes;
    private Boolean isActive;

    public static ProductResponse from(Product p) {
        ProductResponse r = new ProductResponse();
        r.id = p.getId();
        r.name = p.getName();
        r.description = p.getDescription();
        r.imageUrl = p.getImageUrl();
        r.hasMultipleSizes = p.getHasMultipleSizes();
        r.isActive = p.getIsActive();
        if (p.getCategory() != null) {
            r.categoryId = p.getCategory().getId();
            r.categoryName = p.getCategory().getName();
        }
        return r;
    }
}
