package com.taskman.notification_service.kafka.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskEvent {
    private String eventType;    // TASK_CREATED, TASK_UPDATED, TASK_ASSIGNED, TASK_COMPLETED, TASK_DELETED...
    private String taskId;
    private String taskTitle;
    private String description;
    private String projectId;
    private String status;
    private String assigneeId;   // User assigned to the task
    private String assignerId;   // User who assigned/updated the task
    private Date dueDate;
    private Date timestamp;
} 