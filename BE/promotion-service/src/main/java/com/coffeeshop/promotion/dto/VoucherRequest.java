package com.coffeeshop.promotion.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class VoucherRequest {
    @NotBlank
    private String code;
    @NotNull @DecimalMin("0.0")
    private BigDecimal discountValue;
    @NotNull @DecimalMin("0.0")
    private BigDecimal minOrderValue;
    @NotNull @Min(1)
    private Integer usageLimit;
    @NotNull
    private LocalDateTime startDate;
    @NotNull
    private LocalDateTime endDate;
}
