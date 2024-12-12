package com.taskman.project_service.dto;

import com.taskman.project_service.entity.enums.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    private Long id;
    private String name;
    private String description;
    private Date startDate;
    private Date endDate;
    private ProjectStatus status;
    private List<ProjectMembershipDTO> memberships;
}