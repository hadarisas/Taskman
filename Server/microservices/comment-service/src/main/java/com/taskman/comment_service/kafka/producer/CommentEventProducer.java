package com.taskman.comment_service.kafka.producer;

import com.taskman.comment_service.kafka.event.CommentEvent;
import com.taskman.comment_service.entity.Comment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${spring.kafka.topic.comment-events}")
    private String topicName;

    public void sendCommentEvent(String eventType, Comment comment) {
        CommentEvent event = CommentEvent.builder()
                .eventType(eventType)
                .commentId(comment.getId())
                .content(comment.getContent())
                .authorId(comment.getAuthorId())
                .entityId(comment.getEntityId())
                .entityType(comment.getEntityType().toString())
                .parentCommentId(comment.getParentCommentId())
                .timestamp(new Date())
                .build();

        kafkaTemplate.send(topicName, event);
        log.info("Comment event sent - Type: {}, CommentId: {}", eventType, comment.getId());
    }
} 