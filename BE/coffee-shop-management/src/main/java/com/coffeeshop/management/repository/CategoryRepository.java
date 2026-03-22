package com.coffeeshop.management.repository;

import com.coffeeshop.management.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByIsActiveTrueOrderByDisplayOrderAsc();

    Page<Category> findAllByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Category> findByNameContainingIgnoreCaseAndIsActiveTrueOrderByDisplayOrderAsc(String name, Pageable pageable);
}
