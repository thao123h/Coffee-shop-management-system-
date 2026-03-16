package com.coffeeshop.management.service;

import com.coffeeshop.management.dto.response.PaymentResponse;
import com.coffeeshop.management.entity.Payment;
import com.coffeeshop.management.enums.PaymentProvider;
import com.coffeeshop.management.enums.PaymentStatus;
import com.coffeeshop.management.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public Page<PaymentResponse> findAllPaged(
            int page, int size,
            String keyword,
            String status,
            String provider,
            LocalDateTime fromDate,
            LocalDateTime toDate) {

        Pageable pageable = PageRequest.of(page, size);

        PaymentStatus statusEnum = null;
        if (status != null && !status.isBlank()) {
            try { statusEnum = PaymentStatus.valueOf(status.toUpperCase()); } catch (Exception ignored) {}
        }

        PaymentProvider providerEnum = null;
        if (provider != null && !provider.isBlank()) {
            try { providerEnum = PaymentProvider.valueOf(provider.toUpperCase()); } catch (Exception ignored) {}
        }

        String kw = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;

        return paymentRepository
                .findAllWithFilters(kw, statusEnum, providerEnum, fromDate, toDate, pageable)
                .map(this::toResponse);
    }

    private PaymentResponse toResponse(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .orderId(p.getOrder() != null ? p.getOrder().getId() : null)
                .provider(p.getProvider())
                .amount(p.getAmount())
                .currency(p.getCurrency())
                .status(p.getStatus())
                .txnRef(p.getTxnRef())
                .transactionNo(p.getTransactionNo())
                .bankCode(p.getBankCode())
                .paidAt(p.getPaidAt())
                .createdAt(p.getCreatedAt())
                .build();
    }

    public List<Payment> findAll() {
        return paymentRepository.findAll();
    }

    public List<Payment> findByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    public Optional<Payment> findById(Long id) {
        return paymentRepository.findById(id);
    }

    public Optional<Payment> findByTxnRef(String txnRef) {
        return paymentRepository.findByTxnRef(txnRef);
    }

    public List<Payment> findByStatus(PaymentStatus status) {
        return paymentRepository.findByStatus(status);
    }

    @Transactional
    public Payment save(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Transactional
    public void deleteById(Long id) {
        paymentRepository.deleteById(id);
    }

    public long countByStatus(PaymentStatus status) {
        return paymentRepository.countByStatus(status);
    }
}

