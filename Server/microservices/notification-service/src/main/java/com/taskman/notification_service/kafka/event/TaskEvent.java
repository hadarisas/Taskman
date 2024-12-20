package com.taskman.notification_service.kafka.event;

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
public class TaskEvent {
    private String eventType;    // TASK_ASSIGNED, TASK_UPDATED, TASK_COMPLETED, TASK_OVERDUE, TASK_DEADLINE_APPROACHING
    private String taskId;
    private String taskTitle;
    private String projectId;
    private String description;
    private String status;       // Current task status
    private String priority;
    private Date startDate;
    private Date dueDate;
    private Date timestamp;      // When the event was created

    private String assignerId;   // User who made the assignment/change
    private String assigneeId;   // For TASK_ASSIGNED events
    private List<String> assigneeIds;  // All current task assignees
    private List<String> adminIds;     // Project admins to notify

    private String message;      // custom message for the notification
} 