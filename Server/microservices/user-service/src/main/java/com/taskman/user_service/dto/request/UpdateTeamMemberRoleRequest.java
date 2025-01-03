package com.taskman.user_service.dto.request;

import com.taskman.user_service.entity.enums.TeamRole;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTeamMemberRoleRequest {
    @NotNull(message = "Role is required")
    private TeamRole role;
} 