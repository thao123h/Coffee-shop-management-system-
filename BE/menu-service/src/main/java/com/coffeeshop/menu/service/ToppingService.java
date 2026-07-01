package com.coffeeshop.menu.service;

import com.coffeeshop.menu.dto.ToppingRequest;
import com.coffeeshop.menu.dto.ToppingSnapshotDto;
import com.coffeeshop.menu.entity.Topping;
import com.coffeeshop.menu.repository.ToppingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ToppingService {

    private final ToppingRepository toppingRepository;

    public List<Topping> getAll()   { return toppingRepository.findByIsActiveTrue(); }

    public Topping getById(Long id) {
        return toppingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topping not found: " + id));
    }

    public ToppingSnapshotDto getSnapshot(Long id) {
        Topping t = getById(id);
        return new ToppingSnapshotDto(t.getId(), t.getName(), t.getPrice(), t.getIsActive());
    }

    public List<ToppingSnapshotDto> getBatchSnapshots(List<Long> ids) {
        return toppingRepository.findByIdIn(ids).stream()
                .map(t -> new ToppingSnapshotDto(t.getId(), t.getName(), t.getPrice(), t.getIsActive()))
                .toList();
    }

    public Topping create(ToppingRequest req) {
        Topping t = Topping.builder()
                .name(req.getName())
                .price(req.getPrice())
                .isActive(true)
                .build();
        return toppingRepository.save(t);
    }

    public Topping update(Long id, ToppingRequest req) {
        Topping t = getById(id);
        t.setName(req.getName());
        t.setPrice(req.getPrice());
        return toppingRepository.save(t);
    }

    public Topping toggleActive(Long id) {
        Topping t = getById(id);
        t.setIsActive(!t.getIsActive());
        return toppingRepository.save(t);
    }

    public void delete(Long id) {
        Topping t = getById(id);
        t.setIsActive(false);
        toppingRepository.save(t);
    }
}
