package com.coffeeshop.management.dto.response;

import com.coffeeshop.management.entity.User;
import com.coffeeshop.management.enums.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String fullName;
    private Role role;
    
    @JsonProperty("isActive")
    private Boolean isActive;

    public static UserResponse from(User u) {
        return new UserResponse(u.getId(), u.getUsername(), u.getFullName(), u.getRole(), u.getIsActive());
    }
}
