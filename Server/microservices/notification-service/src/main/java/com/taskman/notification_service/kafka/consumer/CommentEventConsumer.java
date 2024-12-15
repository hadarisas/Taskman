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
                case "REPLIED" -> handleCommentReplied(event);
                case "MENTIONED" -> handleUserMentioned(event);
                default -> log.warn("Unknown comment event type: {}", event.getEventType());
            }
        } catch (Exception e) {
            log.error("Error processing comment event: {}", event, e);
        }
    }

    private void handleCommentCreated(CommentEventDto event) {
        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .type(NotificationType.COMMENT_ADDED)
                .content("New comment on your " + event.getEntityType().toLowerCase() + ": " +
                        truncateContent(event.getContent()))
                .recipientId(getEntityOwner(event.getEntityId(), event.getEntityType()))
                .entityId(event.getEntityId())
                .entityType(EntityType.valueOf(event.getEntityType()))
                .build();

        notificationService.createNotification(request);
    }

    private void handleCommentReplied(CommentEventDto event) {
        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .type(NotificationType.COMMENT_REPLIED)
                .content("Someone replied to your comment: " + truncateContent(event.getContent()))
                .recipientId(getCommentAuthor(event.getParentCommentId()))
                .entityId(event.getEntityId())
                .entityType(EntityType.valueOf(event.getEntityType()))
                .build();

        notificationService.createNotification(request);
    }

    private void handleUserMentioned(CommentEventDto event) {
        // Implementation for handling user mentions in comments
        //TO-DO
    }

    private String truncateContent(String content) {
        return content.length() > 50 ? content.substring(0, 47) + "..." : content;
    }

    private String getEntityOwner(String entityId, String entityType) {
        return "entity_owner_id";
    }

    private String getCommentAuthor(Long parentCommentId) {
        return "comment_author_id";
    }
} 