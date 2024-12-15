package com.taskman.notification_service.kafka.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskman.notification_service.dto.request.CreateNotificationRequest;
import com.taskman.notification_service.entity.enums.EntityType;
import com.taskman.notification_service.entity.enums.NotificationType;
import com.taskman.notification_service.kafka.event.TaskEvent;
import com.taskman.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TaskEventConsumer {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "${spring.kafka.topic.task-events}")
    public void handleTaskEvent(String eventJson) {
        try {
            TaskEvent event = objectMapper.readValue(eventJson, TaskEvent.class);
            log.info("Received task event: {}", event);

            switch (event.getEventType()) {
                case "TASK_CREATED" -> handleTaskCreated(event);
                case "TASK_ASSIGNED" -> handleTaskAssigned(event);
                case "TASK_UPDATED" -> handleTaskUpdated(event);
                case "TASK_COMPLETED" -> handleTaskCompleted(event);
                case "TASK_DUE_SOON" -> handleTaskDueSoon(event);
                default -> log.warn("Unknown task event type: {}", event.getEventType());
            }
        } catch (Exception e) {
            log.error("Error processing task event: {}", eventJson, e);
        }
    }

    private void handleTaskCreated(TaskEvent event) {
        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .type(NotificationType.TASK_CREATED)
                .content("New task created: " + event.getTaskTitle())
                .recipientId(event.getAssigneeId())
                .entityId(event.getTaskId())
                .entityType(EntityType.TASK)
                .build();

        notificationService.createNotification(request);
    }

    private void handleTaskAssigned(TaskEvent event) {
        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .type(NotificationType.TASK_ASSIGNED)
                .content("You have been assigned to task: " + event.getTaskTitle())
                .recipientId(event.getAssigneeId())
                .entityId(event.getTaskId())
                .entityType(EntityType.TASK)
                .build();

        notificationService.createNotification(request);
    }

    private void handleTaskUpdated(TaskEvent event) {
        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .type(NotificationType.TASK_UPDATED)
                .content("Task has been updated: " + event.getTaskTitle())
                .recipientId(event.getAssigneeId())
                .entityId(event.getTaskId())
                .entityType(EntityType.TASK)
                .build();

        notificationService.createNotification(request);
    }

    private void handleTaskCompleted(TaskEvent event) {
        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .type(NotificationType.TASK_COMPLETED)
                .content("Task completed: " + event.getTaskTitle())
                .recipientId(event.getAssigneeId())
                .entityId(event.getTaskId())
                .entityType(EntityType.TASK)
                .build();

        notificationService.createNotification(request);
    }

    private void handleTaskDueSoon(TaskEvent event) {
        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .type(NotificationType.TASK_DUE_SOON)
                .content("Task due soon: " + event.getTaskTitle())
                .recipientId(event.getAssigneeId())
                .entityId(event.getTaskId())
                .entityType(EntityType.TASK)
                .build();

        notificationService.createNotification(request);
    }
} 