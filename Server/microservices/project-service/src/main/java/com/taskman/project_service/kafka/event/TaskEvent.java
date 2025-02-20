package com.taskman.project_service.kafka.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskEvent {
    private String eventType;  // TASK_CREATED, TASK_UPDATED, TASK_ASSIGNED, TASK_COMPLETED
    private String taskId;
    private String taskTitle;
    private String assigneeId;
    private String assignerId;
    private String projectId;
    private String description;
} 