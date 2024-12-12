package com.taskman.project_service.dto.request;

import com.taskman.project_service.entity.enums.ProjectStatus;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Date;

@Data
public class CreateProjectRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "Start date is required")
    private Date startDate;

    private Date endDate;

    @NotNull(message = "Status is required")
    private ProjectStatus status;
}