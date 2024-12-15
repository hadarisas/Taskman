package com.taskman.comment_service.dto.request;

import com.taskman.comment_service.entity.enums.EntityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCommentRequest {
    @NotBlank(message = "Content is required")
    private String content;

    @NotBlank(message = "Entity ID is required")
    private String entityId;

    @NotNull(message = "Entity type is required")
    private EntityType entityType;

    private Long parentCommentId;  
} 