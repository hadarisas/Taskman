package com.taskman.comment_service.dto;

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
public class CommentDTO {
    private Long id;
    private String content;
    private Date createdAt;
    private Date updatedAt;
    private String authorId;
    private String entityId;
    private EntityType entityType;
    private Long parentCommentId;
    private boolean isEdited;
} 