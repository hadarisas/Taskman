package com.taskman.comment_service.kafka.consumer;

import com.taskman.comment_service.kafka.event.TaskEvent;
import com.taskman.comment_service.entity.enums.EntityType;
import com.taskman.comment_service.service.interfaces.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TaskEventConsumer {

    private final CommentService commentService;

    @KafkaListener(
            topics = "${spring.kafka.topic.task-events}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void handleTaskEvent(TaskEvent event) {
        log.info("Received task event: {}", event);

        if ("DELETED".equals(event.getEventType())) {
            commentService.deleteAllCommentsByEntity(event.getTaskId(), EntityType.TASK);
            log.info("Deleted all comments for task: {}", event.getTaskId());
        }
    }
} 