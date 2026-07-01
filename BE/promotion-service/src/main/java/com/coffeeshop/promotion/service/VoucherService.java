package com.coffeeshop.promotion.service;

import com.coffeeshop.promotion.dto.*;
import com.coffeeshop.promotion.entity.Voucher;
import com.coffeeshop.promotion.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherService {

    private final VoucherRepository voucherRepository;

    public List<Voucher> getAll() { return voucherRepository.findAll(); }

    public Voucher getById(Long id) {
        return voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found: " + id));
    }

    public Voucher getByCode(String code) {
        return voucherRepository.findByCode(code.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Voucher not found: " + code));
    }

    public Voucher create(VoucherRequest req) {
        if (voucherRepository.existsByCode(req.getCode())) {
            throw new RuntimeException("Voucher code already exists: " + req.getCode());
        }
        Voucher v = Voucher.builder()
                .code(req.getCode().toUpperCase())
                .discountValue(req.getDiscountValue())
                .minOrderValue(req.getMinOrderValue())
                .usageLimit(req.getUsageLimit())
                .usageCount(0)
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .isActive(true)
                .build();
        return voucherRepository.save(v);
    }

    public Voucher update(Long id, VoucherRequest req) {
        Voucher v = getById(id);
        v.setDiscountValue(req.getDiscountValue());
        v.setMinOrderValue(req.getMinOrderValue());
        v.setUsageLimit(req.getUsageLimit());
        v.setStartDate(req.getStartDate());
        v.setEndDate(req.getEndDate());
        return voucherRepository.save(v);
    }

    public void toggleActive(Long id) {
        Voucher v = getById(id);
        v.setIsActive(!v.getIsActive());
        voucherRepository.save(v);
    }

    /**
     * Validates voucher and calculates discount WITHOUT committing usage.
     * Called by Order Service before persisting the order.
     */
    public VoucherValidateResponse validate(String code, VoucherValidateRequest req) {
        Voucher v = voucherRepository.findByCode(code.toUpperCase()).orElse(null);

        if (v == null) {
            return VoucherValidateResponse.builder()
                    .valid(false).errorCode("VOUCHER_NOT_FOUND")
                    .message("Voucher not found: " + code).build();
        }
        if (!Boolean.TRUE.equals(v.getIsActive())) {
            return VoucherValidateResponse.builder()
                    .valid(false).errorCode("VOUCHER_INACTIVE")
                    .message("Voucher is inactive").build();
        }
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(v.getStartDate()) || now.isAfter(v.getEndDate())) {
            return VoucherValidateResponse.builder()
                    .valid(false).errorCode("VOUCHER_EXPIRED")
                    .message("Voucher is expired or not started").build();
        }
        if (v.getUsageCount() >= v.getUsageLimit()) {
            return VoucherValidateResponse.builder()
                    .valid(false).errorCode("VOUCHER_LIMIT_EXCEEDED")
                    .message("Voucher usage limit exceeded").build();
        }
        if (req.getOrderAmount().compareTo(v.getMinOrderValue()) < 0) {
            return VoucherValidateResponse.builder()
                    .valid(false).errorCode("VOUCHER_BELOW_MIN_ORDER")
                    .message("Order amount does not meet minimum: " + v.getMinOrderValue()).build();
        }

        BigDecimal discount = v.getDiscountValue().min(req.getOrderAmount());
        BigDecimal finalAmount = req.getOrderAmount().subtract(discount);

        return VoucherValidateResponse.builder()
                .valid(true)
                .voucherCode(v.getCode())
                .discountValue(v.getDiscountValue())
                .calculatedDiscount(discount)
                .finalAmount(finalAmount)
                .build();
    }

    /**
     * Commits voucher usage. Called by Order Service AFTER order is persisted.
     */
    @Transactional
    public void apply(String code, VoucherApplyRequest req) {
        Voucher v = voucherRepository.findByCode(code.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Voucher not found: " + code));
        v.setUsageCount(v.getUsageCount() + 1);
        voucherRepository.save(v);
    }
}
