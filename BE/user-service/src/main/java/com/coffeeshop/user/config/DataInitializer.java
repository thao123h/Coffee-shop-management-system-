package com.coffeeshop.user.config;

import com.coffeeshop.user.entity.User;
import com.coffeeshop.user.enums.Role;
import com.coffeeshop.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createDefaultUser("admin",  "123456", "Administrator", Role.ADMIN);
        createDefaultUser("manager","123456", "Manager",       Role.MANAGER);
        createDefaultUser("staff",  "123456", "Staff",         Role.STAFF);
    }

    private void createDefaultUser(String username, String password, String fullName, Role role) {
        if (!userRepository.existsByUsername(username)) {
            User user = User.builder()
                    .username(username)
                    .password(passwordEncoder.encode(password))
                    .fullName(fullName)
                    .role(role)
                    .isActive(true)
                    .build();
            userRepository.save(user);
            log.info("Created default user: {} / {} ({})", username, password, role);
        }
    }
}
