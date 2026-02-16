package com.coffeeshop.management.service;

import com.coffeeshop.management.entity.Topping;
import com.coffeeshop.management.repository.ToppingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ToppingService {

    private final ToppingRepository toppingRepository;

    public List<Topping> findAll() {
        return toppingRepository.findAll();
    }

    public List<Topping> findAllActive() {
        return toppingRepository.findByIsActiveTrue();
    }

    public Optional<Topping> findById(Long id) {
        return toppingRepository.findById(id);
    }

    @Transactional
    public Topping save(Topping topping) {
        return toppingRepository.save(topping);
    }

    @Transactional
    public void deleteById(Long id) {
        toppingRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return toppingRepository.existsById(id);
    }
}
