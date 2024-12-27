package com.taskman.user_service.dto.request;

import com.taskman.user_service.entity.enums.UserRole;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String name;
    
    @Email(message = "Invalid email format")
    private String email;
    
    private String password;
    private UserRole role;
    private Boolean active;
}