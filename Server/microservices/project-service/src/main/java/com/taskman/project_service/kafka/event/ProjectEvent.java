package com.taskman.project_service.kafka.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectEvent {
    private String eventType;  // PROJECT_CREATED, PROJECT_UPDATED, PROJECT_COMPLETED, USER_ASSIGNED
    private String projectId;
    private String projectName;
    private String description;
    private String managerId;
    private String userId;     // For USER_ASSIGNED events
    private String status;
} 