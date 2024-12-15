package com.taskman.notification_service.dto;

import lombok.Data;

@Data
public class CommentEventDto {
    private String eventType;
    private Long commentId;
    private String content;
    private String authorId;
    private String entityId;
    private String entityType;
    private Long parentCommentId;
    private Long timestamp;
}
