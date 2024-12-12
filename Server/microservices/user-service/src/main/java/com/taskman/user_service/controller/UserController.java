package com.taskman.user_service.controller;

import com.taskman.user_service.dto.TeamDTO;
import com.taskman.user_service.dto.UserDTO;
import com.taskman.user_service.dto.request.CreateUserRequest;
import com.taskman.user_service.dto.request.UpdateUserRequest;
import com.taskman.user_service.dto.request.UpdateUserRoleRequest;
import com.taskman.user_service.service.interfaces.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Create user
    @PostMapping("/register")
    @Operation(summary = "Register new user")
    @ApiResponse(responseCode = "201", description = "User created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<UserDTO> registerUser(@Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.createUser(request));
    }

    // Get user by id
    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // Get user by email
    @GetMapping("/email/{email}")
    public UserDTO getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    // Get all users
    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // Update
    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        return userService.updateUser(id, request);
    }

    // Update  user role
    @PutMapping("/{id}/role")
    public UserDTO updateUserRole(@PathVariable Long id, @Valid @RequestBody UpdateUserRoleRequest request) {
        return userService.updateUserRole(id, request.getRole());
    }

    // Activate user
    @PutMapping("/{id}/activate")
    public UserDTO activateUser(@PathVariable Long id) {
        return userService.activateUser(id);
    }

    // Deactivate user
    @PutMapping("/{id}/deactivate")
    public UserDTO deactivateUser(@PathVariable Long id) {
        return userService.deactivateUser(id);
    }

    // Delete
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    // Get user teams
    @GetMapping("/{id}/teams")
    public List<TeamDTO> getUserTeams(@PathVariable Long id) {
        return userService.getUserTeams(id);
    }

    // Validation 
    @GetMapping("/exists/email/{email}")
    public boolean existsByEmail(@PathVariable String email) {
        return userService.existsByEmail(email);
    }
}