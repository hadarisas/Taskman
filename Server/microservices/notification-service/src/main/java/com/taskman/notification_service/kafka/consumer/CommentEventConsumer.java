package com.taskman.notification_service.kafka.consumer;

import com.taskman.notification_service.dto.CommentEventDto;
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
public class CommentEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = "${spring.kafka.topic.comment-events}",
            containerFactory = "commentKafkaListenerContainerFactory"
    )
    public void handleCommentEvent(CommentEventDto event) {
        try {
            log.info("Received comment event: {}", event);

            switch (event.getEventType()) {
                case "CREATED" -> handleCommentCreated(event);
                case "UPDATED" -> handleCommentUpdated(event);
                default -> log.warn("Unknown comment event type: {}", event.getEventType());
            }
        } catch (Exception e) {
            log.error("Error processing comment event: {}", event, e);
        }
    }

    private void handleCommentCreated(CommentEventDto event) {
        String content;
        List<String> recipientIds;

        if (event.getParentCommentId() != null && event.getParentCommentAuthorId() != null) {
            content = "Someone replied to your comment: " + truncateContent(event.getContent());
            recipientIds = List.of(event.getParentCommentAuthorId());
        } else {
            content = "New comment on your " + event.getEntityType().toLowerCase() + ": " +
                    truncateContent(event.getContent());
            recipientIds = event.getEntityOwners();
        }

        for (String recipientId : recipientIds) {
            if (!recipientId.equals(event.getAuthorId())) {
                CreateNotificationRequest request = CreateNotificationRequest.builder()
                        .type(NotificationType.COMMENT_ADDED)
                        .content(content)
                        .recipientId(recipientId)
                        .entityId(event.getEntityId())
                        .entityType(EntityType.valueOf(event.getEntityType()))
                        .build();

                log.info("Creating notification for recipient {}: {}", recipientId, request);
                notificationService.createNotification(request);
            }
        }
    }

    private void handleCommentUpdated(CommentEventDto event) {
        String content = "A comment was updated on your " + event.getEntityType().toLowerCase() + ": " +
                truncateContent(event.getContent());

        for (String recipientId : event.getEntityOwners()) {
            if (!recipientId.equals(event.getAuthorId())) {
                CreateNotificationRequest request = CreateNotificationRequest.builder()
                        .type(NotificationType.COMMENT_UPDATED)
                        .content(content)
                        .recipientId(recipientId)
                        .entityId(event.getEntityId())
                        .entityType(EntityType.valueOf(event.getEntityType()))
                        .build();

                log.info("Creating notification for recipient {}: {}", recipientId, request);
                notificationService.createNotification(request);
            }
        }
    }

    private String truncateContent(String content) {
        return content.length() > 50 ? content.substring(0, 47) + "..." : content;
    }
} 