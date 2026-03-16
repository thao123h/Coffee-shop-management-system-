package com.coffeeshop.management.repository;

import com.coffeeshop.management.entity.Payment;
import com.coffeeshop.management.enums.PaymentProvider;
import com.coffeeshop.management.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByOrderId(Long orderId);

    Optional<Payment> findByTxnRef(String txnRef);

    List<Payment> findByStatus(PaymentStatus status);

    @Query("""
            SELECT p FROM Payment p
            WHERE (:keyword IS NULL OR :keyword = ''
                   OR LOWER(p.txnRef) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(CAST(p.order.id AS string)) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:status IS NULL OR p.status = :status)
              AND (:provider IS NULL OR p.provider = :provider)
              AND (:fromDate IS NULL OR p.createdAt >= :fromDate)
              AND (:toDate IS NULL OR p.createdAt <= :toDate)
            ORDER BY p.createdAt DESC
            """)
    Page<Payment> findAllWithFilters(
            @Param("keyword") String keyword,
            @Param("status") PaymentStatus status,
            @Param("provider") PaymentProvider provider,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable);

    long countByStatus(PaymentStatus status);
}

