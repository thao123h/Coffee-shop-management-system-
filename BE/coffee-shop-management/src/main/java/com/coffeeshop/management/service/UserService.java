package com.coffeeshop.management.service;

import com.coffeeshop.management.entity.User;
import com.coffeeshop.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Page<User> findAll(int page, int size, String keyword) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return userRepository.findAllByFullNameContainingIgnoreCaseOrUsernameContainingIgnoreCase(keyword, keyword, pageable);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Transactional
    public User save(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void deleteById(Long id) {
        userRepository.findById(id).ifPresent(u -> {
            u.setIsActive(false);
            userRepository.save(u);
        });
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
}
