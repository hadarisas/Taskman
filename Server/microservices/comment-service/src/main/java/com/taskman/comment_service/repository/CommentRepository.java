package com.taskman.comment_service.repository;

import com.taskman.comment_service.entity.Comment;
import com.taskman.comment_service.entity.enums.EntityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    // Find comments by entity (project or task)
    Page<Comment> findByEntityIdAndEntityTypeOrderByCreatedAtDesc(
            String entityId, 
            EntityType entityType, 
            Pageable pageable
    );
    
    // Find replies to a comment
    Page<Comment> findByParentCommentIdOrderByCreatedAtDesc(
            Long parentCommentId, 
            Pageable pageable
    );
    
    // Find comments by author
    Page<Comment> findByAuthorIdOrderByCreatedAtDesc(
            String authorId, 
            Pageable pageable
    );
    
    // Count comments for an entity
    long countByEntityIdAndEntityType(String entityId, EntityType entityType);
    
    // Count replies to a comment
    long countByParentCommentId(Long parentCommentId);
    
    // Find root comments (no parent) for an entity
    @Query("SELECT c FROM Comment c WHERE c.entityId = :entityId " +
           "AND c.entityType = :entityType AND c.parentCommentId IS NULL " +
           "ORDER BY c.createdAt DESC")
    Page<Comment> findRootComments(
            @Param("entityId") String entityId,
            @Param("entityType") EntityType entityType,
            Pageable pageable
    );
    
    // Find latest comments for multiple entities
    @Query("SELECT c FROM Comment c WHERE c.entityId IN :entityIds " +
           "AND c.entityType = :entityType ORDER BY c.createdAt DESC")
    List<Comment> findLatestCommentsByEntityIds(
            @Param("entityIds") List<String> entityIds,
            @Param("entityType") EntityType entityType,
            Pageable pageable
    );
    
    // Check if user has commented on an entity
    boolean existsByEntityIdAndEntityTypeAndAuthorId(
            String entityId,
            EntityType entityType,
            String authorId
    );
    
    // Delete all comments for an entity
    void deleteByEntityIdAndEntityType(String entityId, EntityType entityType);
    void deleteAllByEntityTypeAndEntityId(EntityType entityType, String entityId);

} 