package com.taskman.comment_service.kafka.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskEvent {
    private String eventType;  // CREATED, UPDATED, DELETED, COMPLETED
    private String taskId;
    private String taskTitle;
    private String projectId;
    private String status;
} 