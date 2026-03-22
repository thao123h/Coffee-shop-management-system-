package com.coffeeshop.management.controller;

import com.coffeeshop.management.dto.request.UserRequest;
import com.coffeeshop.management.dto.response.ApiResponse;
import com.coffeeshop.management.dto.response.UserResponse;
import com.coffeeshop.management.entity.User;
import com.coffeeshop.management.enums.ErrorCode;
import com.coffeeshop.management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    /** GET /users — Lấy tất cả nhân viên */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String keyword) {
        Page<UserResponse> responses = userService.findAll(page, size, keyword)
                .map(UserResponse::from);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    /** GET /users/{id} — Chi tiết một người dùng */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(u -> ResponseEntity.ok(ApiResponse.success(UserResponse.from(u))))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.<UserResponse>error(ErrorCode.NOT_FOUND)));
    }

    /** POST /users — Tạo tài khoản nhân viên mới */
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody UserRequest request) {
        // Check duplicate username
        if (userService.existsByUsername(request.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.<UserResponse>error(ErrorCode.BAD_REQUEST));
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.<UserResponse>error(ErrorCode.BAD_REQUEST));
        }

        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getRole()
        );
        User saved = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(UserResponse.from(saved)));
    }

    /** PUT /users/{id} — Cập nhật thông tin người dùng */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequest request) {

        return userService.findById(id).map(user -> {
            // If username changed, check conflict
            if (!user.getUsername().equals(request.getUsername())
                    && userService.existsByUsername(request.getUsername())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.<UserResponse>error(ErrorCode.BAD_REQUEST));
            }
            user.setUsername(request.getUsername());
            user.setFullName(request.getFullName());
            user.setRole(request.getRole());
            // Only update password if a new one is provided
            if (request.getPassword() != null && !request.getPassword().isBlank()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            return ResponseEntity.ok(ApiResponse.success(UserResponse.from(userService.save(user))));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.<UserResponse>error(ErrorCode.NOT_FOUND)));
    }

    /** PATCH /users/{id}/toggle-active — Bật/tắt trạng thái */
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<UserResponse>> toggleActive(@PathVariable Long id) {
        return userService.findById(id).map(user -> {
            user.setIsActive(!user.getIsActive());
            return ResponseEntity.ok(ApiResponse.success(UserResponse.from(userService.save(user))));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.<UserResponse>error(ErrorCode.NOT_FOUND)));
    }

    /** DELETE /users/{id} — Xóa tài khoản */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        if (!userService.findById(id).isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<Void>error(ErrorCode.NOT_FOUND));
        }
        userService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
