package com.coffeeshop.user.controller;

import com.coffeeshop.user.dto.request.LoginRequest;
import com.coffeeshop.user.dto.request.SignupRequest;
import com.coffeeshop.user.dto.response.ApiResponse;
import com.coffeeshop.user.dto.response.JwtResponse;
import com.coffeeshop.user.dto.response.UserResponse;
import com.coffeeshop.user.entity.User;
import com.coffeeshop.user.repository.UserRepository;
import com.coffeeshop.user.security.JwtUtils;
import com.coffeeshop.user.security.UserDetailsImpl;
import com.coffeeshop.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest req) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
            );
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
            String token = jwtUtils.generateToken(user);

            JwtResponse jwtResponse = new JwtResponse(
                    token,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    user.getFullName(),
                    userDetails.getRole()
            );
            return ResponseEntity.ok(ApiResponse.success(jwtResponse));

        } catch (Exception e) {
            // Return 401 instead of letting Spring Security return 403
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Sai tên đăng nhập hoặc mật khẩu"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<UserResponse>> signup(@Valid @RequestBody SignupRequest req) {
        try {
            UserResponse response = userService.register(req);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
