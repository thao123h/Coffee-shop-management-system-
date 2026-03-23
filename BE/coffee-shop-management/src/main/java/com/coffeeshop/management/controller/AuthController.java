package com.coffeeshop.management.controller;

import com.coffeeshop.management.dto.request.LoginRequest;
import com.coffeeshop.management.dto.request.SignupRequest;
import com.coffeeshop.management.dto.response.JwtResponse;
import com.coffeeshop.management.dto.response.MessageResponse;

import com.coffeeshop.management.entity.User;
import com.coffeeshop.management.repository.UserRepository;
import com.coffeeshop.management.security.jwt.JwtUtils;
import com.coffeeshop.management.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    try {
      Authentication authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

      SecurityContextHolder.getContext().setAuthentication(authentication);
      String jwt = jwtUtils.generateJwtToken(authentication);

      UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
      List<String> roles = userDetails.getAuthorities().stream()
          .map(item -> item.getAuthority())
          .collect(Collectors.toList());

      return ResponseEntity.ok(new JwtResponse(jwt,
                           userDetails.getId(),
                           userDetails.getUsername(),
                           roles.isEmpty() ? "" : roles.get(0)));
    } catch (AuthenticationException e) {
      // Catch BadCredentialsException, DisabledException, etc.
      return ResponseEntity
          .status(401)
          .body(new MessageResponse("Error: Tên đăng nhập hoặc mật khẩu không chính xác!"));
    }
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getUsername(),
               encoder.encode(signUpRequest.getPassword()),
               signUpRequest.getFullName(),
               signUpRequest.getRole());

    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }

  @GetMapping("/me")
  public ResponseEntity<?> getCurrentUser(Authentication authentication) {
    if (authentication == null) {
      return ResponseEntity.status(401).body(new MessageResponse("Not authenticated"));
    }
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    Map<String, Object> response = new HashMap<>();
    response.put("id", userDetails.getId());
    response.put("username", userDetails.getUsername());
    response.put("roles", roles);

    return ResponseEntity.ok(response);
  }
}
