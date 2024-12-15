package com.taskman.project_service.dto;

import com.taskman.project_service.entity.enums.MemberRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMembershipDTO {
    private Long id;
    private String userId;
    private MemberRole role;
    private Date joinedAt;
}