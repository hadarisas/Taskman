package com.taskman.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class TokenRefreshFilterFactory extends AbstractGatewayFilterFactory<TokenRefreshFilterFactory.Config> {

    private final RestTemplate restTemplate;

    public TokenRefreshFilterFactory(RestTemplate restTemplate) {
        super(Config.class);
        this.restTemplate = restTemplate;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return new TokenRefreshGatewayFilter(restTemplate);
    }

    @Override
    public String name() {
        return "TokenRefresh";
    }

    public static class Config {
    }
}