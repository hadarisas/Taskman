package com.taskman.task_service.dto;


import com.taskman.task_service.entity.enums.Priority;
import com.taskman.task_service.entity.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private Priority priority;
    private TaskStatus status;
    private Date startDate;
    private Date dueDate;
    private String projectId;
    private Date createdAt;
    private Date updatedAt;
    private String createdBy;

    @Builder.Default
    private List<TaskAssignmentDTO> assignments = new ArrayList<>();
}
