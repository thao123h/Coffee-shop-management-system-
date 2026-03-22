package com.coffeeshop.management.repository;

import com.coffeeshop.management.entity.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    Optional<Voucher> findByCode(String code);
    List<Voucher> findByIsActiveTrue();
    Page<Voucher> findByCodeContainingIgnoreCase(String keyword, Pageable pageable);
    List<Voucher> findByIsActiveTrueAndEndDateAfter(java.time.LocalDateTime now);
}
