package com.taskman.comment_service.kafka.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentEvent {
    private String eventType;          // CREATED, UPDATED, DELETED, REPLIED
    private Long commentId;
    private String content;
    private String authorId;
    private String entityId;           // ID of the task or project
    private String entityType;         // TASK or PROJECT
    private Long parentCommentId;      // For replies
    private List<String> entityOwners;  // Changed from entityOwnerId
    private String parentCommentAuthorId; // Author of the parent comment
    private Date timestamp;
}
 