package com.coffeeshop.management.dto.response;

import java.util.List;
public class JwtResponse {

    private final String accessToken;
    private final String tokenType = "Bearer";
    private final Long id;
    private final String username;
    private final String role;

    public JwtResponse(String accessToken, Long id, String username, String role) {
        this.accessToken = accessToken;
        this.id = id;
        this.username = username;
        this.role = role;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }
}