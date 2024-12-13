package com.taskman.comment_service.dao.impl;

import com.taskman.comment_service.dao.interfaces.CommentDao;
import com.taskman.comment_service.entity.Comment;
import com.taskman.comment_service.entity.enums.EntityType;
import com.taskman.comment_service.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Transactional
public class CommentDaoImpl implements CommentDao {

    private final CommentRepository commentRepository;

    @Override
    public Comment save(Comment comment) {
        return commentRepository.save(comment);
    }

    @Override
    public Optional<Comment> findById(Long id) {
        return commentRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        commentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Comment> findByEntityId(String entityId, EntityType entityType, Pageable pageable) {
        return commentRepository.findByEntityIdAndEntityTypeOrderByCreatedAtDesc(
                entityId, entityType, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Comment> findReplies(Long parentCommentId, Pageable pageable) {
        return commentRepository.findByParentCommentIdOrderByCreatedAtDesc(
                parentCommentId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Comment> findByAuthor(String authorId, Pageable pageable) {
        return commentRepository.findByAuthorIdOrderByCreatedAtDesc(authorId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Comment> findRootComments(String entityId, EntityType entityType, Pageable pageable) {
        return commentRepository.findRootComments(entityId, entityType, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Comment> findLatestComments(List<String> entityIds, EntityType entityType, Pageable pageable) {
        return commentRepository.findLatestCommentsByEntityIds(entityIds, entityType, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByEntity(String entityId, EntityType entityType) {
        return commentRepository.countByEntityIdAndEntityType(entityId, entityType);
    }

    @Override
    @Transactional(readOnly = true)
    public long countReplies(Long parentCommentId) {
        return commentRepository.countByParentCommentId(parentCommentId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasUserCommented(String entityId, EntityType entityType, String authorId) {
        return commentRepository.existsByEntityIdAndEntityTypeAndAuthorId(
                entityId, entityType, authorId);
    }

    @Override
    public void deleteByEntity(String entityId, EntityType entityType) {
        commentRepository.deleteByEntityIdAndEntityType(entityId, entityType);
    }
} 