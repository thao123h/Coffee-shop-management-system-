package com.coffeeshop.management.dto.request;

import com.coffeeshop.management.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRequest {

    @NotBlank(message = "Username is required")
    @Size(max = 20, message = "Username must be at most 20 characters")
    private String username;

    // Only required for create; optional on update (leave blank = keep existing)
    @Size(min = 6, max = 120, message = "Password must be 6–120 characters")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotNull(message = "Role is required")
    private Role role;
}
