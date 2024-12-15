package com.taskman.comment_service.kafka.consumer;

import com.taskman.comment_service.kafka.event.ProjectEvent;
import com.taskman.comment_service.entity.enums.EntityType;
import com.taskman.comment_service.service.interfaces.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ProjectEventConsumer {

    private final CommentService commentService;

    @KafkaListener(
            topics = "${spring.kafka.topic.project-events}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void handleProjectEvent(ProjectEvent event) {
        log.info("Received project event: {}", event);

        if ("DELETED".equals(event.getEventType())) {
            commentService.deleteAllCommentsByEntity(event.getProjectId(), EntityType.PROJECT);
            log.info("Deleted all comments for project: {}", event.getProjectId());
        }
    }
} 