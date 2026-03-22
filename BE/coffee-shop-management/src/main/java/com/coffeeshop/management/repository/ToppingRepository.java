package com.coffeeshop.management.repository;

import com.coffeeshop.management.entity.Topping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ToppingRepository extends JpaRepository<Topping, Long> {
    List<Topping> findByIsActiveTrue();

    Page<Topping> findAllByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Topping> findByNameContainingIgnoreCaseAndIsActiveTrue(String name, Pageable pageable);
}
