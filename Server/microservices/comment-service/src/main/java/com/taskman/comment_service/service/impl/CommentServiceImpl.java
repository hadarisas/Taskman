package com.taskman.comment_service.service.impl;

import com.taskman.comment_service.dao.interfaces.CommentDao;
import com.taskman.comment_service.dto.CommentDTO;
import com.taskman.comment_service.dto.event.CommentEvent;
import com.taskman.comment_service.dto.request.CreateCommentRequest;
import com.taskman.comment_service.dto.request.UpdateCommentRequest;
import com.taskman.comment_service.dto.response.CommentResponse;
import com.taskman.comment_service.entity.Comment;
import com.taskman.comment_service.entity.enums.EntityType;
import com.taskman.comment_service.exception.CommentAccessDeniedException;
import com.taskman.comment_service.exception.CommentNotFoundException;
import com.taskman.comment_service.exception.InvalidCommentException;
import com.taskman.comment_service.kafka.producer.CommentEventProducer;
import com.taskman.comment_service.service.interfaces.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentDao commentDao;
    private final CommentEventProducer commentEventProducer;

    @Override
    public CommentDTO createComment(CreateCommentRequest request, String authorId) {
        if (request.getParentCommentId() != null) {
            commentDao.findById(request.getParentCommentId())
                    .orElseThrow(() -> new InvalidCommentException("Parent comment not found"));
        }

        Comment comment = Comment.builder()
                .content(request.getContent())
                .entityId(request.getEntityId())
                .entityType(request.getEntityType())
                .authorId(authorId)
                .parentCommentId(request.getParentCommentId())
                .build();

        Comment savedComment = commentDao.save(comment);

        sendCommentEvent("CREATED", savedComment);

        return convertToDTO(savedComment);
    }

    @Override
    public CommentDTO updateComment(Long commentId, UpdateCommentRequest request, String userId) {
        Comment comment = commentDao.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        if (!comment.getAuthorId().equals(userId)) {
            throw new CommentAccessDeniedException(userId, commentId);
        }

        comment.setContent(request.getContent());
        comment.setEdited(true);

        Comment updatedComment = commentDao.save(comment);
        sendCommentEvent("UPDATED", updatedComment);

        return convertToDTO(updatedComment);
    }

    @Override
    public void deleteComment(Long commentId, String userId) {
        Comment comment = commentDao.findById(commentId)
                .orElseThrow(() -> new CommentNotFoundException(commentId));

        if (!comment.getAuthorId().equals(userId)) {
            throw new CommentAccessDeniedException(userId, commentId);
        }

        commentDao.deleteById(commentId);
        sendCommentEvent("DELETED", comment);
    }

    @Override
    @Transactional(readOnly = true)
    public CommentDTO getComment(Long commentId) {
        return commentDao.findById(commentId)
                .map(this::convertToDTO)
                .orElseThrow(() -> new CommentNotFoundException(commentId));
    }

    @Override
    @Transactional(readOnly = true)
    public CommentResponse getCommentsByEntity(String entityId, EntityType entityType, Pageable pageable) {
        Page<Comment> commentPage = commentDao.findByEntityId(entityId, entityType, pageable);
        return createCommentResponse(commentPage);
    }

    @Override
    @Transactional(readOnly = true)
    public CommentResponse getReplies(Long parentCommentId, Pageable pageable) {
        Page<Comment> repliesPage = commentDao.findReplies(parentCommentId, pageable);
        return createCommentResponse(repliesPage);
    }

    @Override
    @Transactional(readOnly = true)
    public CommentResponse getCommentsByAuthor(String authorId, Pageable pageable) {
        Page<Comment> commentPage = commentDao.findByAuthor(authorId, pageable);
        return createCommentResponse(commentPage);
    }

    @Override
    @Transactional(readOnly = true)
    public CommentResponse getRootComments(String entityId, EntityType entityType, Pageable pageable) {
        Page<Comment> rootComments = commentDao.findRootComments(entityId, entityType, pageable);
        return createCommentResponse(rootComments);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getLatestComments(List<String> entityIds, EntityType entityType, int limit) {
        return commentDao.findLatestComments(entityIds, entityType, Pageable.ofSize(limit))
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getCommentCount(String entityId, EntityType entityType) {
        return commentDao.countByEntity(entityId, entityType);
    }

    @Override
    @Transactional(readOnly = true)
    public long getReplyCount(Long parentCommentId) {
        return commentDao.countReplies(parentCommentId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasUserCommented(String entityId, EntityType entityType, String userId) {
        return commentDao.hasUserCommented(entityId, entityType, userId);
    }

    @Override
    @Transactional
    public void deleteAllCommentsByEntity(String entityId, EntityType entityType) {
        List<Comment> comments = commentDao.findByEntityId(entityId, entityType);
        
        comments.forEach(comment ->
            commentEventProducer.sendCommentEvent("DELETED", comment)
        );
        
        commentDao.deleteByEntity(entityId, entityType);
    }

    @Override
    @Transactional
    public void handleDeletedUser(String userId) {
        List<Comment> userComments = commentDao.findByAuthor(userId);
        userComments.forEach(comment -> {
            comment.setAuthorId("DELETED_USER");
            comment.setContent("[This comment was made by a deleted user]");
            commentDao.save(comment);
            
            commentEventProducer.sendCommentEvent("UPDATED", comment);
        });
        

        userComments.forEach(comment -> {
            commentEventProducer.sendCommentEvent("DELETED", comment);
            commentDao.deleteById(comment.getId());
        });
        
        
    }

    private CommentResponse createCommentResponse(Page<Comment> commentPage) {
        List<CommentDTO> comments = commentPage.getContent()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return CommentResponse.builder()
                .comments(comments)
                .totalComments(commentPage.getTotalElements())
                .pageNumber(commentPage.getNumber())
                .pageSize(commentPage.getSize())
                .hasNext(commentPage.hasNext())
                .build();
    }

    private CommentDTO convertToDTO(Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .authorId(comment.getAuthorId())
                .entityId(comment.getEntityId())
                .entityType(comment.getEntityType())
                .parentCommentId(comment.getParentCommentId())
                .isEdited(comment.isEdited())
                .build();
    }

    private void sendCommentEvent(String eventType, Comment comment) {
        commentEventProducer.sendCommentEvent(eventType, comment);
    }
} 