package com.taskman.notification_service.dto;

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
public class TaskEventDto {
    private String eventType;
    private String taskId;
    private String taskTitle;
    private String projectId;
    private String description;
    private String status;
    private String priority;
    private Date startDate;
    private Date dueDate;
    private Date timestamp;

    private String assignerId;
    private String assigneeId;
    private List<String> assigneeIds;
    private List<String> adminIds;

    private String message;
}