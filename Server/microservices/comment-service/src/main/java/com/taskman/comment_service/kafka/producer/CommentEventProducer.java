package com.taskman.comment_service.kafka.producer;

import com.taskman.comment_service.client.ProjectServiceClient;
import com.taskman.comment_service.client.TaskServiceClient;
import com.taskman.comment_service.dao.interfaces.CommentDao;
import com.taskman.comment_service.dto.TaskNotificationRecipientsDto;
import com.taskman.comment_service.entity.Comment;
import com.taskman.comment_service.entity.enums.EntityType;
import com.taskman.comment_service.kafka.event.CommentEvent;
import com.taskman.comment_service.security.JwtService;
import com.taskman.comment_service.dto.ProjectMembershipDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final CommentDao commentDao;
    private final TaskServiceClient taskServiceClient;
    private final ProjectServiceClient projectServiceClient;
    private final JwtService jwtService;

    @Value("${spring.kafka.topic.comment-events}")
    private String topicName;

    private List<String> getEntityOwners(String entityId, EntityType entityType, String token) {
        try {
            if (entityType == EntityType.TASK) {
                TaskNotificationRecipientsDto recipients = taskServiceClient
                        .getTaskNotificationRecipients(Long.parseLong(entityId), token)
                        .getBody();

                // Combining assignee and project admins into one list
                List<String> notificationRecipients = new ArrayList<>();
                if (recipients.getAssigneeId() != null) {
                    notificationRecipients.add(recipients.getAssigneeId());
                }
                if (recipients.getProjectAdminIds() != null) {
                    notificationRecipients.addAll(recipients.getProjectAdminIds());
                }
                return notificationRecipients;

            } else if (entityType == EntityType.PROJECT) {
                List<ProjectMembershipDto> members = projectServiceClient
                        .getProjectMembers(entityId, token)
                        .getBody();
                return members.stream()
                        .map(ProjectMembershipDto::getUserId)
                        .toList();
            }
            return List.of();
        } catch (Exception e) {
            log.error("Error getting entity owners for {} of type {}: {}",
                    entityId, entityType, e.getMessage());
            throw new RuntimeException("Failed to get entity owners", e);
        }
    }

    public void sendCommentEvent(String eventType, Comment comment) {
        String token = "Bearer " + jwtService.generateSystemToken();
        List<String> entityOwners = getEntityOwners(comment.getEntityId(), comment.getEntityType(), token);
        String parentCommentAuthor = getParentCommentAuthor(comment.getParentCommentId());

        CommentEvent event = CommentEvent.builder()
                .eventType(eventType)
                .commentId(comment.getId())
                .content(comment.getContent())
                .authorId(comment.getAuthorId())
                .entityId(comment.getEntityId())
                .entityType(comment.getEntityType().toString())
                .parentCommentId(comment.getParentCommentId())
                .entityOwners(entityOwners)
                .parentCommentAuthorId(parentCommentAuthor)
                .timestamp(new Date())
                .build();

        kafkaTemplate.send(topicName, event);
        log.info("Comment event sent - Type: {}, CommentId: {}", eventType, comment.getId());
    }

    private String getParentCommentAuthor(Long parentCommentId) {
        if (parentCommentId == null) {
            return null;
        }
        return commentDao.findById(parentCommentId)
                .map(Comment::getAuthorId)
                .orElse(null);
    }
} 