package com.taskman.notification_service.kafka.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskman.notification_service.dto.request.CreateNotificationRequest;
import com.taskman.notification_service.entity.enums.EntityType;
import com.taskman.notification_service.entity.enums.NotificationType;
import com.taskman.notification_service.kafka.event.ProjectEvent;
import com.taskman.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProjectEventConsumer {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "${spring.kafka.topic.project-events}")
    public void handleProjectEvent(String eventJson) {
        try {
            ProjectEvent event = objectMapper.readValue(eventJson, ProjectEvent.class);
            log.info("Received project event: {}", event);

            switch (event.getEventType()) {
                case "PROJECT_CREATED" -> handleProjectCreated(event);
                case "PROJECT_MEMBER_ADDED" -> handleProjectMemberAdded(event);
                case "PROJECT_UPDATED" -> handleProjectUpdated(event);
                case "PROJECT_COMPLETED" -> handleProjectCompleted(event);
                case "PROJECT_DELETED" -> handleProjectDeleted(event);
                default -> log.warn("Unknown project event type: {}", event.getEventType());
            }
        } catch (Exception e) {
            log.error("Error processing project event: {}", eventJson, e);
        }
    }

    private void handleProjectCreated(ProjectEvent event) {
        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .type(NotificationType.PROJECT_CREATED)
                .content("New project created: " + event.getProjectName())
                .recipientId(event.getUserId())
                .entityId(event.getProjectId())
                .entityType(EntityType.PROJECT)
                .build();

        notificationService.createNotification(request);
    }

    private void handleProjectMemberAdded(ProjectEvent event) {
        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .type(NotificationType.PROJECT_MEMBER_ADDED)
                .content("You have been added to project: " + event.getProjectName())
                .recipientId(event.getUserId())
                .entityId(event.getProjectId())
                .entityType(EntityType.PROJECT)
                .build();

        notificationService.createNotification(request);
    }

    private void handleProjectUpdated(ProjectEvent event) {
        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .type(NotificationType.PROJECT_UPDATED)
                .content("Project has been updated: " + event.getProjectName())
                .recipientId(event.getUserId())
                .entityId(event.getProjectId())
                .entityType(EntityType.PROJECT)
                .build();

        notificationService.createNotification(request);
    }

    private void handleProjectCompleted(ProjectEvent event) {
        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .type(NotificationType.PROJECT_COMPLETED)
                .content("Project completed: " + event.getProjectName())
                .recipientId(event.getUserId())
                .entityId(event.getProjectId())
                .entityType(EntityType.PROJECT)
                .build();

        notificationService.createNotification(request);
    }

    private void handleProjectDeleted(ProjectEvent event) {
        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .type(NotificationType.PROJECT_DELETED)
                .content("Project deleted: " + event.getProjectName())
                .recipientId(event.getUserId())
                .entityId(event.getProjectId())
                .entityType(EntityType.PROJECT)
                .build();

        notificationService.createNotification(request);
    }
} 