package com.coffeeshop.menu.repository;

import com.coffeeshop.menu.entity.Topping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ToppingRepository extends JpaRepository<Topping, Long> {
    List<Topping> findByIsActiveTrue();
    List<Topping> findByIdIn(List<Long> ids);
}
