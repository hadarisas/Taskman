package com.taskman.notification_service.dto.request;

import com.taskman.notification_service.entity.enums.EntityType;
import com.taskman.notification_service.entity.enums.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateNotificationRequest {
    @NotNull(message = "Notification type is required")
    private NotificationType type;

    @NotBlank(message = "Content is required")
    private String content;

    @NotBlank(message = "Recipient ID is required")
    private String recipientId;

    @NotBlank(message = "Entity ID is required")
    private String entityId;

    @NotNull(message = "Entity type is required")
    private EntityType entityType;
} 