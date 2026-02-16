package com.coffeeshop.management.service;

import com.coffeeshop.management.entity.Voucher;
import com.coffeeshop.management.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VoucherService {

    private final VoucherRepository voucherRepository;

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
    public Voucher save(Voucher voucher) {
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
