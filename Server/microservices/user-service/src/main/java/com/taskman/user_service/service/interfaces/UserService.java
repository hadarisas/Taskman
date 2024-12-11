package com.taskman.user_service.service.interfaces;

import com.taskman.user_service.dto.TeamDTO;
import com.taskman.user_service.dto.UserDTO;
import com.taskman.user_service.dto.request.CreateUserRequest;
import com.taskman.user_service.dto.request.UpdateUserRequest;
import com.taskman.user_service.entity.enums.UserRole;

import java.util.List;

public interface UserService {
    // Create
    UserDTO createUser(CreateUserRequest request);

    // Read
    UserDTO getUserById(Long id);
    UserDTO getUserByEmail(String email);
    List<UserDTO> getAllUsers();
    boolean existsByEmail(String email);

    // Update
    UserDTO updateUser(Long id, UpdateUserRequest request);
    UserDTO updateUserRole(Long id, UserRole role);
    UserDTO activateUser(Long id);
    UserDTO deactivateUser(Long id);

    // Delete
    void deleteUser(Long id);

    // Team related
    List<TeamDTO> getUserTeams(Long userId);
}