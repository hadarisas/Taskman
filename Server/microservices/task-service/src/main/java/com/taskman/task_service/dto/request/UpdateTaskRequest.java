package com.taskman.task_service.dto.request;


import com.taskman.task_service.entity.enums.Priority;
import com.taskman.task_service.entity.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskRequest {
    private String title;
    private String description;
    private Priority priority;
    private TaskStatus status;
    private Date startDate;
    private Date dueDate;
}