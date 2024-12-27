package com.taskman.user_service.dto.response;

import com.taskman.user_service.dto.UserDTO;
import com.taskman.user_service.entity.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UserDTO user;
    boolean authenticated;
} 