package com.coffeeshop.user.dto.request;

import com.coffeeshop.user.enums.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    private String fullName;
    private Role role = Role.STAFF;
}
