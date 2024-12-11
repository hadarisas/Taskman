package com.taskman.user_service.dto;

import com.taskman.user_service.entity.enums.TeamRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamMembershipDTO {
    private Long id;
    private Long userId;
    private String userName;
    private TeamRole role;
}