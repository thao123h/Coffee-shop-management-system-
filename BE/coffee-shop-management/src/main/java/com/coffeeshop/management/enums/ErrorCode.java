package com.coffeeshop.management.enums;


public enum ErrorCode {

    // AUTH
    AUTH_INVALID_CREDENTIALS("AUTH_001", "Invalid username or password"),

    // COMMON
    BAD_REQUEST("COMMON_400", "Bad request"),
    NOT_FOUND("COMMON_404", "Resource not found"),
    INTERNAL_ERROR("COMMON_500", "Internal server error");

    private final String code;
    private final String defaultMessage;

    ErrorCode(String code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }

    public String getCode() {
        return code;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
}