package com.taskman.notification_service.dto;

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
public class ProjectEventDto {
    private String eventType;
    private String projectId;
    private String projectName;
    private String description;
    private String managerId;
    private String userId;     // For member assignment events
    private String status;
    private List<String> adminIds;
    private List<String> memberIds;  // For all-member notifications
    private Date endDate;
    private String updateType;  // ADMINISTRATIVE or GENERAL
    private String role;

}