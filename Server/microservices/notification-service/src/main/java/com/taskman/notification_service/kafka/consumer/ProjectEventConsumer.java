package com.taskman.notification_service.kafka.consumer;

import com.taskman.notification_service.dto.ProjectEventDto;
import com.taskman.notification_service.dto.request.CreateNotificationRequest;
import com.taskman.notification_service.entity.enums.EntityType;
import com.taskman.notification_service.entity.enums.NotificationType;
import com.taskman.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProjectEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = "${spring.kafka.topic.project-events}",
            containerFactory = "projectKafkaListenerContainerFactory"
    )
    public void handleProjectEvent(ProjectEventDto event) {
        try {
            log.info("Received project event: {}", event);

            switch (event.getEventType()) {
                case "PROJECT_UPDATED" -> handleProjectUpdated(event);
                case "PROJECT_COMPLETED" -> handleProjectCompleted(event);
                case "PROJECT_MEMBER_ASSIGNED" -> handleMemberAssigned(event);
                case "PROJECT_MEMBER_ROLE_UPDATED" -> handleMemberRoleUpdated(event);
                case "PROJECT_OVERDUE" -> handleProjectOverdue(event);
                case "PROJECT_DEADLINE_APPROACHING" -> handleProjectDeadlineApproaching(event);
                default -> log.warn("Unknown project event type: {}", event.getEventType());
            }
        } catch (Exception e) {
            log.error("Error processing project event: {}", event, e);
        }
    }

    private void handleProjectUpdated(ProjectEventDto event) {
        String content = String.format("Project '%s' has been updated. New status: %s",
                event.getProjectName(), event.getStatus());

        List<String> recipients = "ADMINISTRATIVE".equals(event.getUpdateType())
                ? event.getAdminIds()
                : event.getMemberIds();

        for (String recipientId : recipients) {
            CreateNotificationRequest request = CreateNotificationRequest.builder()
                    .type(NotificationType.PROJECT_UPDATED)
                    .content(content)
                    .recipientId(recipientId)
                    .entityId(event.getProjectId())
                    .entityType(EntityType.PROJECT)
                    .build();

            log.info("Creating notification for recipient {}: {}", recipientId, request);
            notificationService.createNotification(request);
        }
    }

    private void handleProjectOverdue(ProjectEventDto event) {
        String content = String.format("Project '%s' is overdue! Due date was: %s",
                event.getProjectName(), event.getEndDate());

        notifyAdmins(event, NotificationType.PROJECT_OVERDUE, content);
    }

    private void handleProjectDeadlineApproaching(ProjectEventDto event) {
        String content = String.format("Project '%s' deadline is approaching! Due date: %s",
                event.getProjectName(), event.getEndDate());

        notifyAdmins(event, NotificationType.PROJECT_DEADLINE_APPROACHING, content);
    }

    private void handleMemberAssigned(ProjectEventDto event) {
        String content;
        NotificationType type;

        if ("PROJECT_MEMBER_ASSIGNED".equals(event.getEventType())) {
            content = String.format("You have been added to project '%s'",
                    event.getProjectName());
            type = NotificationType.PROJECT_MEMBER_ADDED;
        } else if ("PROJECT_MEMBER_ROLE_UPDATED".equals(event.getEventType())) {
            content = String.format("Your role has been updated to %s in project '%s'",
                    event.getRole(),
                    event.getProjectName());
            type = NotificationType.PROJECT_MEMBER_ROLE_UPDATED;
        } else {
            log.warn("Unknown member event type: {}", event.getEventType());
            return;
        }

        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .type(type)
                .content(content)
                .recipientId(event.getUserId())
                .entityId(event.getProjectId())
                .entityType(EntityType.PROJECT)
                .build();

        log.info("Creating notification for member {}: {}", event.getUserId(), request);
        notificationService.createNotification(request);
    }

    private void handleProjectCompleted(ProjectEventDto event) {
        String content = String.format("Project '%s' has been marked as completed",
                event.getProjectName());

        for (String memberId : event.getMemberIds()) {
            CreateNotificationRequest request = CreateNotificationRequest.builder()
                    .type(NotificationType.PROJECT_COMPLETED)
                    .content(content)
                    .recipientId(memberId)
                    .entityId(event.getProjectId())
                    .entityType(EntityType.PROJECT)
                    .build();

            log.info("Creating completion notification for member {}: {}", memberId, request);
            notificationService.createNotification(request);
        }
    }

    private void handleMemberRoleUpdated(ProjectEventDto event) {
        String content = String.format("Your role has been updated to %s in project '%s'",
                event.getRole(),
                event.getProjectName());

        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .type(NotificationType.PROJECT_MEMBER_ROLE_UPDATED)
                .content(content)
                .recipientId(event.getUserId())
                .entityId(event.getProjectId())
                .entityType(EntityType.PROJECT)
                .build();

        log.info("Creating role update notification for member {}: {}", event.getUserId(), request);
        notificationService.createNotification(request);
    }

    private void notifyAdmins(ProjectEventDto event, NotificationType type, String content) {
        for (String adminId : event.getAdminIds()) {
            CreateNotificationRequest request = CreateNotificationRequest.builder()
                    .type(type)
                    .content(content)
                    .recipientId(adminId)
                    .entityId(event.getProjectId())
                    .entityType(EntityType.PROJECT)
                    .build();

            log.info("Creating notification for admin {}: {}", adminId, request);
            notificationService.createNotification(request);
        }
    }
} 