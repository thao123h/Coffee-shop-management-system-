package com.coffeeshop.menu.repository;

import com.coffeeshop.menu.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryIdAndIsActiveTrue(Long categoryId);
    List<Product> findByIsActiveTrue();

    @Query("""
        SELECT p FROM Product p WHERE
            (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
        AND (:activeOnly = false OR p.isActive = true)
    """)
    Page<Product> filterProducts(@Param("keyword") String keyword,
                                  @Param("activeOnly") boolean activeOnly,
                                  Pageable pageable);
}
