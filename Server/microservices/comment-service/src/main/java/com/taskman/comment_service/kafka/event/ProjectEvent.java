package com.taskman.comment_service.kafka.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectEvent {
    private String eventType;  // CREATED, UPDATED, DELETED, COMPLETED
    private String projectId;
    private String projectName;
    private String status;
} 