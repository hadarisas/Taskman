package com.taskman.comment_service.service.interfaces;

import com.taskman.comment_service.dto.CommentDTO;
import com.taskman.comment_service.dto.request.CreateCommentRequest;
import com.taskman.comment_service.dto.request.UpdateCommentRequest;
import com.taskman.comment_service.dto.response.CommentResponse;
import com.taskman.comment_service.entity.enums.EntityType;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CommentService {
    // CRUD operations
    CommentDTO createComment(CreateCommentRequest request, String authorId);
    CommentDTO updateComment(Long commentId, UpdateCommentRequest request, String userId);
    void deleteComment(Long commentId, String userId);
    CommentDTO getComment(Long commentId);

    // Query operations
    CommentResponse getCommentsByEntity(String entityId, EntityType entityType, Pageable pageable);
    CommentResponse getReplies(Long parentCommentId, Pageable pageable);
    CommentResponse getCommentsByAuthor(String authorId, Pageable pageable);
    CommentResponse getRootComments(String entityId, EntityType entityType, Pageable pageable);
    List<CommentDTO> getLatestComments(List<String> entityIds, EntityType entityType, int limit);

    // Utility operations
    long getCommentCount(String entityId, EntityType entityType);
    long getReplyCount(Long parentCommentId);
    boolean hasUserCommented(String entityId, EntityType entityType, String userId);
    void deleteAllCommentsByEntity(String entityId, EntityType entityType);
} 