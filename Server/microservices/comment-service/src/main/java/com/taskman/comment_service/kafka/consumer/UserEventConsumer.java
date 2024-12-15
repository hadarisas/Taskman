package com.taskman.comment_service.kafka.consumer;

import com.taskman.comment_service.kafka.event.UserEvent;
import com.taskman.comment_service.service.interfaces.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserEventConsumer {

    private final CommentService commentService;

    @KafkaListener(
            topics = "${spring.kafka.topic.user-events}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void handleUserEvent(UserEvent event) {
        log.info("Received user event: {}", event);

        if ("DELETED".equals(event.getEventType())) {
            commentService.handleDeletedUser(event.getUserId());
            log.info("Handled deleted user: {}", event.getUserId());
        }
    }
} 