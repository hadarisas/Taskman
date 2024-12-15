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
public class ProjectEvent {
    private String eventType;    // PROJECT_CREATED, PROJECT_MEMBER_ADDED, PROJECT_UPDATED, PROJECT_COMPLETED, PROJECT_DELETED
    private String projectId;
    private String projectName;
    private String description;
    private String status;
    private String userId;       // The user being added/affected
    private String actionUserId; // The user performing the action
    private Date timestamp;
} 