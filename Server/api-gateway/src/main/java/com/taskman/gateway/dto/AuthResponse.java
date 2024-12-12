package com.taskman.gateway.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String message;
    private String accessToken;
    private String refreshToken;
} 