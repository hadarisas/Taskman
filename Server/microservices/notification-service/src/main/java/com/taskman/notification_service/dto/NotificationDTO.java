package com.taskman.notification_service.dto;

import com.taskman.notification_service.entity.enums.EntityType;
import com.taskman.notification_service.entity.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Long id;
    private NotificationType type;
    private String content;
    private String recipientId;
    private String entityId;
    private EntityType entityType;
    private boolean isRead;
    private LocalDateTime readAt;
    private LocalDateTime createdAt;
} 