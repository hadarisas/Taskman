package com.taskman.gateway.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "application.security.jwt")
@Data
public class JwtConfig {
    private String secretKey;
    private long accessTokenExpiration = 86400000; // 1 day in milliseconds
    private long refreshTokenExpiration = 604800000; // 7 days in milliseconds
}
