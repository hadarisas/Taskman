package com.taskman.project_service.kafka.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectEvent {
    private String eventType;  // PROJECT_CREATED, PROJECT_UPDATED, PROJECT_COMPLETED, PROJECT_OVERDUE, PROJECT_DEADLINE_APPROACHING, PROJECT_MEMBER_ASSIGNED
    private String projectId;
    private String projectName;
    private String description;
    private String managerId;
    private String userId;     // For USER_ASSIGNED events
    private String status;
    private List<String> adminIds;
    private List<String> memberIds;  
    private Date endDate;
    private String updateType;  // ADMINISTRATIVE or GENERAL
    private String role;
}