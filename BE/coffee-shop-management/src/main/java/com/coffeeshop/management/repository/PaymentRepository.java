package com.coffeeshop.management.repository;

import com.coffeeshop.management.entity.Payment;
import com.coffeeshop.management.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByOrderId(Long orderId);
    Optional<Payment> findByTxnRef(String txnRef);
    List<Payment> findByStatus(PaymentStatus status);
}
