package com.taskman.notification_service.kafka.consumer;

import com.taskman.notification_service.dto.TaskEventDto;
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
public class TaskEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = "${spring.kafka.topic.task-events}",
            containerFactory = "taskKafkaListenerContainerFactory"
    )
    public void handleTaskEvent(TaskEventDto event) {
        try {
            log.info("Received task event: {}", event);

            switch (event.getEventType()) {
                case "TASK_CREATED" -> handleTaskCreated(event);
                case "TASK_ASSIGNED" -> handleTaskAssigned(event);
                case "TASK_UPDATED" -> handleTaskUpdated(event);
                case "TASK_COMPLETED" -> handleTaskCompleted(event);
                case "TASK_OVERDUE" -> handleTaskOverdue(event);
                case "TASK_DEADLINE_APPROACHING" -> handleTaskDeadlineApproaching(event);
                default -> log.warn("Unknown task event type: {}", event.getEventType());
            }
        } catch (Exception e) {
            log.error("Error processing task event: {}", event, e);
        }
    }

    private void handleTaskCreated(TaskEventDto event) {
        String content = String.format("New task created: '%s' in project ID: %s",
                event.getTaskTitle(), event.getProjectId());

        notifyAssignees(event, NotificationType.TASK_CREATED, content);
    }

    private void handleTaskAssigned(TaskEventDto event) {
        String content = String.format("You have been assigned to task '%s' by %s",
                event.getTaskTitle(), event.getAssignerId());

        System.out.println("Assigned: "+ event);
        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .type(NotificationType.TASK_ASSIGNED)
                .content(content)
                .recipientId(event.getAssigneeId())
                .entityId(event.getTaskId())
                .entityType(EntityType.TASK)
                .build();

        log.info("Creating assignment notification for assignee {}: {}", event.getAssigneeId(), request);
        notificationService.createNotification(request);
    }

    private void handleTaskUpdated(TaskEventDto event) {
        String content = String.format("Task '%s' has been updated. Status: %s",
                event.getTaskTitle(), event.getStatus());

        notifyAssignees(event, NotificationType.TASK_UPDATED, content);
    }

    private void handleTaskCompleted(TaskEventDto event) {
        String content = String.format("Task '%s' has been marked as completed",
                event.getTaskTitle());

        // Notify all assignees and project admins
        List<String> allRecipients = event.getAssigneeIds();
        allRecipients.addAll(event.getAdminIds());

        for (String recipientId : allRecipients) {
            CreateNotificationRequest request = CreateNotificationRequest.builder()
                    .type(NotificationType.TASK_COMPLETED)
                    .content(content)
                    .recipientId(recipientId)
                    .entityId(event.getTaskId())
                    .entityType(EntityType.TASK)
                    .build();

            log.info("Creating completion notification for recipient {}: {}", recipientId, request);
            notificationService.createNotification(request);
        }
    }

    private void handleTaskOverdue(TaskEventDto event) {
        String content = String.format("Task '%s' is overdue! Due date was: %s",
                event.getTaskTitle(), event.getDueDate());

        notifyAssigneesAndAdmins(event, NotificationType.TASK_OVERDUE, content);
    }

    private void handleTaskDeadlineApproaching(TaskEventDto event) {
        String content = String.format("Task '%s' deadline is approaching! Due date: %s",
                event.getTaskTitle(), event.getDueDate());

        notifyAssigneesAndAdmins(event, NotificationType.TASK_DUE_SOON, content);
    }

    private void notifyAssignees(TaskEventDto event, NotificationType type, String content) {
        for (String assigneeId : event.getAssigneeIds()) {
            CreateNotificationRequest request = CreateNotificationRequest.builder()
                    .type(type)
                    .content(content)
                    .recipientId(assigneeId)
                    .entityId(event.getTaskId())
                    .entityType(EntityType.TASK)
                    .build();

            log.info("Creating notification for assignee {}: {}", assigneeId, request);
            notificationService.createNotification(request);
        }
    }

    private void notifyAssigneesAndAdmins(TaskEventDto event, NotificationType type, String content) {
        List<String> allRecipients = event.getAssigneeIds();
        allRecipients.addAll(event.getAdminIds());

        for (String recipientId : allRecipients) {
            CreateNotificationRequest request = CreateNotificationRequest.builder()
                    .type(type)
                    .content(content)
                    .recipientId(recipientId)
                    .entityId(event.getTaskId())
                    .entityType(EntityType.TASK)
                    .build();

            log.info("Creating notification for recipient {}: {}", recipientId, request);
            notificationService.createNotification(request);
        }
    }
}