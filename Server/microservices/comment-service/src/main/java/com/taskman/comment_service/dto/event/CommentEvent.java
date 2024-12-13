package com.taskman.comment_service.dto.event;

import com.taskman.comment_service.entity.enums.EntityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentEvent {
    private String eventType;  // CREATED, UPDATED, DELETED
    private Long commentId;
    private String content;
    private String authorId;
    private String entityId;
    private EntityType entityType;
    private Long parentCommentId;
    private Date timestamp;
} 