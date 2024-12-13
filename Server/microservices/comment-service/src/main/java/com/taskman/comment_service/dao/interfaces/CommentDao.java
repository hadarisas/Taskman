package com.taskman.comment_service.dao.interfaces;

import com.taskman.comment_service.entity.Comment;
import com.taskman.comment_service.entity.enums.EntityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface CommentDao {
    Comment save(Comment comment);
    Optional<Comment> findById(Long id);
    void deleteById(Long id);
    
    Page<Comment> findByEntityId(String entityId, EntityType entityType, Pageable pageable);
    Page<Comment> findReplies(Long parentCommentId, Pageable pageable);
    Page<Comment> findByAuthor(String authorId, Pageable pageable);
    Page<Comment> findRootComments(String entityId, EntityType entityType, Pageable pageable);
    
    List<Comment> findLatestComments(List<String> entityIds, EntityType entityType, Pageable pageable);
    
    long countByEntity(String entityId, EntityType entityType);
    long countReplies(Long parentCommentId);
    
    boolean hasUserCommented(String entityId, EntityType entityType, String authorId);
    void deleteByEntity(String entityId, EntityType entityType);
} 