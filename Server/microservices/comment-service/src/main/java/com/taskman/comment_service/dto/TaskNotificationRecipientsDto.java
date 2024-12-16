package com.taskman.comment_service.dto;

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
    private String assigneeId;
    private List<String> projectAdminIds;
}
