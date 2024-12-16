package com.taskman.notification_service.dto;

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
public class CommentEventDto {
    private String eventType;
    private Long commentId;
    private String content;
    private String authorId;
    private String entityId;
    private String entityType;
    private Long parentCommentId;
    private List<String> entityOwners;
    private String parentCommentAuthorId;
    private Date timestamp;
}
