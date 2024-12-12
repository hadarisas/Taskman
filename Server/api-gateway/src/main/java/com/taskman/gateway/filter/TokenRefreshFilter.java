package com.taskman.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import lombok.Data;

@Component
public class TokenRefreshFilter extends AbstractGatewayFilterFactory<TokenRefreshFilter.Config> {

    private final WebClient.Builder webClientBuilder;

    public TokenRefreshFilter(WebClient.Builder webClientBuilder) {
        super(Config.class);
        this.webClientBuilder = webClientBuilder;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String refreshToken = exchange.getRequest().getHeaders().getFirst("Refresh-Token");
            String accessToken = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            if (refreshToken == null || accessToken == null) {
                return chain.filter(exchange);
            }

            // Remove "Bearer " prefix if present
            accessToken = accessToken.replace("Bearer ", "");

            // Call auth service to validate and potentially refresh token
            return webClientBuilder.build()
                    .post()
                    .uri("http://auth-service/api/auth/token/refresh")
                    .header("Refresh-Token", refreshToken)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .retrieve()
                    .bodyToMono(TokenResponse.class)
                    .flatMap(tokenResponse -> {
                        // Update the request headers with the new access token
                        exchange.getRequest().mutate()
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenResponse.getAccessToken())
                                .build();

                        // Continue the filter chain
                        return chain.filter(exchange);
                    })
                    .onErrorResume(error -> {
                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    });
        };
    }

    @Data
    public static class Config {
        private String authServiceUrl = "http://auth-service";
        private String refreshTokenPath = "/api/auth/token/refresh";
        private boolean requireBothTokens = true;
    }

    @Data
    private static class TokenResponse {
        private String accessToken;
        private String refreshToken;
    }
}