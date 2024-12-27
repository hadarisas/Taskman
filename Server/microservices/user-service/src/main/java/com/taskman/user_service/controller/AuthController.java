package com.taskman.user_service.controller;

import com.taskman.user_service.dto.request.AuthenticationRequest;
import com.taskman.user_service.dto.response.AuthenticationResponse;
import com.taskman.user_service.dto.response.UserResponse;
import com.taskman.user_service.entity.User;
import com.taskman.user_service.exception.AuthenticationFailedException;
import com.taskman.user_service.exception.InvalidTokenException;
import com.taskman.user_service.security.JwtService;
import com.taskman.user_service.service.impl.AuthenticationService;
import com.taskman.user_service.util.CookieUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationService authService;

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticates user and returns JWT tokens in cookies")
    @ApiResponse(responseCode = "200", description = "Successfully authenticated")
    @ApiResponse(responseCode = "401", description = "Invalid credentials")
    public ResponseEntity<AuthenticationResponse> login(
            @Valid @RequestBody AuthenticationRequest request,
            HttpServletResponse response
    ) {
        return ResponseEntity.ok(authService.authenticate(request, response));
    }

    @PostMapping("/refresh")
    @ApiResponse(responseCode = "200", description = "New access token generated")
    @ApiResponse(responseCode = "401", description = "Invalid refresh token")
    public ResponseEntity<AuthenticationResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        return ResponseEntity.ok(authService.refreshToken(request, response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Invalidates JWT tokens")
    @ApiResponse(responseCode = "200", description = "Successfully logged out")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // Clear cookies
        Cookie accessCookie = new Cookie("access_token", "");
        accessCookie.setMaxAge(0);
        accessCookie.setPath("/");
        accessCookie.setHttpOnly(true);
        response.addCookie(accessCookie);

        Cookie refreshCookie = new Cookie("refresh_token", "");
        refreshCookie.setMaxAge(0);
        refreshCookie.setPath("/");
        refreshCookie.setHttpOnly(true);
        response.addCookie(refreshCookie);

        return ResponseEntity.ok().build();
    }
    @GetMapping("/check")
    public ResponseEntity<UserResponse> checkAuth(HttpServletRequest request,
                                                  HttpServletResponse response) {
        return ResponseEntity.ok(authService.checkAuth(request, response));
    }
}
