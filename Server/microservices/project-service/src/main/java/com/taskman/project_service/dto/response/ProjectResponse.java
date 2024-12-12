package com.taskman.project_service.dto.response;

import com.taskman.project_service.dto.ProjectDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProjectResponse {
    private ProjectDTO project;
}