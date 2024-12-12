package com.taskman.gateway.filter;

import com.taskman.gateway.dto.AuthResponse;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

public class TokenRefreshGatewayFilter implements GatewayFilter {
    private final RestTemplate restTemplate;
    private static final String REFRESH_TOKEN_COOKIE = "refresh_token";
    private static final String ACCESS_TOKEN_COOKIE = "access_token";

    public TokenRefreshGatewayFilter(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return chain.filter(exchange)
                .then(Mono.defer(() -> {
                    if (exchange.getResponse().getStatusCode() == HttpStatus.UNAUTHORIZED) {
                        return refreshTokenAndRetry(exchange, chain);
                    }
                    return Mono.empty();
                }));
    }

    private Mono<Void> refreshTokenAndRetry(ServerWebExchange exchange, GatewayFilterChain chain) {
        HttpCookie refreshTokenCookie = exchange.getRequest()
                .getCookies()
                .getFirst(REFRESH_TOKEN_COOKIE);

        if (refreshTokenCookie == null) {
            return Mono.empty();
        }

        try {
            // Call refresh token endpoint
            ResponseEntity<AuthResponse> response = restTemplate.postForEntity(
                    "http://localhost:8080/api/auth/refresh",
                    null,
                    AuthResponse.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                // Update cookies with new tokens
                exchange.getResponse().getCookies().add(ACCESS_TOKEN_COOKIE,
                        ResponseCookie.from(ACCESS_TOKEN_COOKIE, response.getBody().getAccessToken())
                                .path("/")
                                .build()
                );

                // Retry the original request with new token
                ServerWebExchange mutatedExchange = exchange.mutate()
                        .request(exchange.getRequest().mutate()
                                .header("Authorization", "Bearer " + response.getBody().getAccessToken())
                                .build())
                        .build();

                return chain.filter(mutatedExchange);
            }
        } catch (Exception e) {
            // Log error and continue with original response
        }

        return Mono.empty();
    }
}