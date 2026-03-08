package com.coffeeshop.management.service;

import com.coffeeshop.management.dto.request.VoucherRequest;
import com.coffeeshop.management.entity.Voucher;
import com.coffeeshop.management.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VoucherService {

    private final VoucherRepository voucherRepository;

    public Page<Voucher> findAll(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        if (keyword != null && !keyword.trim().isEmpty()) {
            return voucherRepository.findByCodeContainingIgnoreCase(keyword.trim(), pageable);
        }
        return voucherRepository.findAll(pageable);
    }

    public List<Voucher> findAll() {
        return voucherRepository.findAll();
    }

    public List<Voucher> findAllActive() {
        return voucherRepository.findByIsActiveTrue();
    }

    public Optional<Voucher> findById(Long id) {
        return voucherRepository.findById(id);
    }

    public Optional<Voucher> findByCode(String code) {
        return voucherRepository.findByCode(code);
    }

    @Transactional
    public Voucher create(VoucherRequest request) {
        Voucher voucher = Voucher.builder()
                .code(request.getCode())
                .discountValue(request.getDiscountValue())
                .minOrderValue(request.getMinOrderValue())
                .usageLimit(request.getUsageLimit())
                .usageCount(0)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .isActive(request.getIsActive())
                .build();
        return voucherRepository.save(voucher);
    }

    @Transactional
    public Voucher update(Long id, VoucherRequest request) {
        Voucher existing = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
        existing.setCode(request.getCode());
        existing.setDiscountValue(request.getDiscountValue());
        existing.setMinOrderValue(request.getMinOrderValue());
        existing.setUsageLimit(request.getUsageLimit());
        existing.setStartDate(request.getStartDate());
        existing.setEndDate(request.getEndDate());
        existing.setIsActive(request.getIsActive());
        return voucherRepository.save(existing);
    }

    @Transactional
    public Voucher toggleActive(Long id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
        voucher.setIsActive(!voucher.getIsActive());
        return voucherRepository.save(voucher);
    }

    @Transactional
    public void deleteById(Long id) {
        voucherRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return voucherRepository.existsById(id);
    }
}
