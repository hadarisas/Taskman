package com.taskman.user_service.service.impl;

import com.taskman.user_service.dao.interfaces.UserDao;
import com.taskman.user_service.dto.TeamDTO;
import com.taskman.user_service.dto.TeamMembershipDTO;
import com.taskman.user_service.dto.UserDTO;
import com.taskman.user_service.dto.request.CreateUserRequest;
import com.taskman.user_service.dto.request.UpdateUserRequest;
import com.taskman.user_service.entity.User;
import com.taskman.user_service.entity.enums.UserRole;
import com.taskman.user_service.exception.EmailAlreadyExistsException;
import com.taskman.user_service.exception.UserNotFoundException;
import com.taskman.user_service.repository.TeamMembershipRepository;
import com.taskman.user_service.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserDao userDao;
    private final TeamMembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserDTO createUser(CreateUserRequest request) {
        // Check if email already exists
        if (userDao.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email is already taken");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : UserRole.USER)
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        User savedUser = userDao.save(user);
        return convertToDTO(savedUser);
    }

    @Override
    @Transactional
    public UserDTO updateUser(Long id, UpdateUserRequest request) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        // Update basic information
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        
        if (request.getEmail() != null) {
            // Check if email is already taken by another user
            if (userDao.existsByEmailAndIdNot(request.getEmail(), id)) {
                throw new EmailAlreadyExistsException("Email is already taken");
            }
            user.setEmail(request.getEmail());
        }
        
        // Update password if provided
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        // Update role if provided (admin only)
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        
        // Update active status if provided (admin only)
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }

        User updatedUser = userDao.save(user);
        return convertToDTO(updatedUser);
    }

    @Override
    public UserDTO updateUserRole(Long id, UserRole role) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        user.setRole(role);
        User updatedUser = userDao.save(user);
        return convertToDTO(updatedUser);
    }

    @Override
    public UserDTO activateUser(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        user.setActive(true);
        User updatedUser = userDao.save(user);
        return convertToDTO(updatedUser);
    }

    @Override
    public UserDTO deactivateUser(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        user.setActive(false);
        User updatedUser = userDao.save(user);
        return convertToDTO(updatedUser);
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return convertToDTO(user);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        User user = userDao.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        return convertToDTO(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userDao.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(Long id) {
        if (!userDao.existsById(id)) {
            throw new UserNotFoundException("User not found with id: " + id);
        }
        userDao.deleteById(id);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userDao.existsByEmail(email);
    }

    @Override
    public List<TeamDTO> getUserTeams(Long userId) {
        return membershipRepository.findByUserId(userId).stream()
                .map(membership -> TeamDTO.builder()
                        .id(membership.getTeam().getId())
                        .name(membership.getTeam().getName())
                        .members(membership.getTeam().getMemberships().stream()
                                .map(m -> TeamMembershipDTO.builder()
                                        .id(m.getId())
                                        .userId(m.getUser().getId())
                                        .userName(m.getUser().getName())
                                        .role(m.getRole())
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());
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