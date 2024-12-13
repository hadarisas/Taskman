package com.taskman.comment_service.kafka;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskman.comment_service.entity.enums.EntityType;
import com.taskman.comment_service.service.impl.CommentServiceImpl;
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
    private final ObjectMapper objectMapper;

    @KafkaListener(
            topics = "${spring.kafka.topic.task-events}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void handleTaskEvent(String event) {
        log.info("Received task event: {}", event);
        consumeTaskEvents(event);
    }

    public void consumeTaskEvents(String event) {
        try {
            JsonNode eventNode = objectMapper.readTree(event);
            String eventType = eventNode.get("eventType").asText();
            String taskId = eventNode.get("taskId").asText();

            if (eventType.equals("DELETE")) {
                //deleteAllByEntityTypeAndEntityId
                commentService.deleteAllCommentsByEntity(taskId, EntityType.TASK);
                log.info("Deleted all comments for task: {}", taskId);
            }
        } catch (Exception e) {
            log.error("Error processing task event: {}", e.getMessage());
        }
    }
} 