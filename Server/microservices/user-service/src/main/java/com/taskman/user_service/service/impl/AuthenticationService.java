package com.taskman.user_service.service.impl;

import com.taskman.user_service.dto.UserDTO;
import com.taskman.user_service.dto.request.AuthenticationRequest;
import com.taskman.user_service.dto.response.AuthenticationResponse;
import com.taskman.user_service.entity.User;
import com.taskman.user_service.exception.AuthenticationFailedException;
import com.taskman.user_service.exception.InvalidTokenException;
import com.taskman.user_service.exception.TokenNotFoundException;
import com.taskman.user_service.repository.UserRepository;
import com.taskman.user_service.security.JwtService;
import com.taskman.user_service.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CookieUtil cookieUtil;

    public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();
            String accessToken = jwtService.generateAccessToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);

            // Set cookies using CookieUtil
            cookieUtil.createCookie(response, "access_token", accessToken, 24 * 60 * 60);
            cookieUtil.createCookie(response, "refresh_token", refreshToken, 7 * 24 * 60 * 60);

            return AuthenticationResponse.builder()
                    .message("Authentication successful")
                    .user(convertToDTO(user))
                    .accessToken(accessToken)     
                    .refreshToken(refreshToken)  
                    .build();
        } catch (Exception e) {
            throw new AuthenticationFailedException("Authentication failed: " + e.getMessage());
        }
    }
    public AuthenticationResponse refreshToken(HttpServletRequest request, HttpServletResponse response) {
        final String refreshToken = cookieUtil.extractToken(request, "refresh_token");
        if (refreshToken == null) {
            throw new TokenNotFoundException("Refresh token is missing");
        }

        String userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail == null) {
            throw new InvalidTokenException("Invalid refresh token");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new AuthenticationFailedException("User not found"));

        if (!jwtService.isTokenValid(refreshToken, user)) {
            throw new InvalidTokenException("Invalid refresh token");
        }

        String accessToken = jwtService.generateAccessToken(user);
        cookieUtil.createCookie(response, "access_token", accessToken, 24 * 60 * 60);

        return AuthenticationResponse.builder()
                .message("Token refreshed successfully")
                .user(convertToDTO(user))
                .accessToken(accessToken)     // Include new access token in response
                .refreshToken(refreshToken)   // Include existing refresh token in response
                .build();
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .active(user.isActive())
                .build();
    }
}