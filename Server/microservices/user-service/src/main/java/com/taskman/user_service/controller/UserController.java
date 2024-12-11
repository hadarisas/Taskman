package com.taskman.user_service.controller;

import com.taskman.user_service.dto.TeamDTO;
import com.taskman.user_service.dto.UserDTO;
import com.taskman.user_service.dto.request.CreateUserRequest;
import com.taskman.user_service.dto.request.UpdateUserRequest;
import com.taskman.user_service.dto.request.UpdateUserRoleRequest;
import com.taskman.user_service.service.interfaces.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create user
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDTO createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.createUser(request);
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