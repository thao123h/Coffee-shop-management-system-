package com.coffeeshop.management.dto.response;

import com.coffeeshop.management.enums.ErrorCode;

public class ApiResponse<T> {

    private boolean success;
    private String code;     // BUSINESS CODE (KHÔNG phải HTTP)
    private String message;  // MESSAGE CHO USER
    private T data;

    public ApiResponse(boolean success, String code, String message, T data) {
        this.success = success;
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "SUCCESS", "Success", data);
    }

    public static <T> ApiResponse<T> error(ErrorCode errorCode) {
        return new ApiResponse<>(
                false,
                errorCode.getCode(),
                errorCode.getDefaultMessage(),
                null
        );
    }

    public boolean isSuccess() { return success; }
    public String getCode() { return code; }
    public String getMessage() { return message; }
    public T getData() { return data; }
}