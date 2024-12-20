package com.taskman.task_service.dto.request;


import com.taskman.task_service.entity.enums.Priority;
import com.taskman.task_service.entity.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @NotNull(message = "Project ID is required")
    private String projectId;

    private Date startDate;
    private Date dueDate;

    @Builder.Default
    private TaskStatus status = TaskStatus.TODO;
}