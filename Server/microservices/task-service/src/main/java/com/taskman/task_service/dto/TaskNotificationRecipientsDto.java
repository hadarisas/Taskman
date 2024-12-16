package com.taskman.task_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskNotificationRecipientsDto {
    private List<String> assigneeIds;  // Changed from assigneeId to assigneeIds
    private List<String> projectAdminIds;
}