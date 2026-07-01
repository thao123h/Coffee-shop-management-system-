package com.coffeeshop.user.dto.response;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String fullName;
    private String role;
    private Boolean isActive;
}
