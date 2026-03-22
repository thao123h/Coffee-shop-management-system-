package com.coffeeshop.management.repository;

import com.coffeeshop.management.enums.Role;
import com.coffeeshop.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);

  Boolean existsByUsername(String username);

  long countByRoleIsNotNull();
  long countByRoleNot(Role role);

  Page<User> findAllByFullNameContainingIgnoreCaseOrUsernameContainingIgnoreCase(String fullName, String username, Pageable pageable);
}
