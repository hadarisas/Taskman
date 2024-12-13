package com.taskman.comment_service.controller;

import com.taskman.comment_service.dto.CommentDTO;
import com.taskman.comment_service.dto.request.CreateCommentRequest;
import com.taskman.comment_service.dto.request.UpdateCommentRequest;
import com.taskman.comment_service.dto.response.CommentResponse;
import com.taskman.comment_service.entity.enums.EntityType;
import com.taskman.comment_service.security.JwtService;
import com.taskman.comment_service.service.interfaces.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<CommentDTO> createComment(
            @Valid @RequestBody CreateCommentRequest request,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        return new ResponseEntity<>(commentService.createComment(request, userId), HttpStatus.CREATED);
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<CommentDTO> getComment(@PathVariable Long commentId) {
        return ResponseEntity.ok(commentService.getComment(commentId));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody UpdateCommentRequest request,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(commentService.updateComment(commentId, request, userId));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/entity/{entityId}")
    public ResponseEntity<CommentResponse> getCommentsByEntity(
            @PathVariable String entityId,
            @RequestParam EntityType entityType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(commentService.getCommentsByEntity(entityId, entityType, pageRequest));
    }

    @GetMapping("/{commentId}/replies")
    public ResponseEntity<CommentResponse> getReplies(
            @PathVariable Long commentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(commentService.getReplies(commentId, pageRequest));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<CommentResponse> getUserComments(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(commentService.getCommentsByAuthor(userId, pageRequest));
    }

    @GetMapping("/entity/{entityId}/root")
    public ResponseEntity<CommentResponse> getRootComments(
            @PathVariable String entityId,
            @RequestParam EntityType entityType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(commentService.getRootComments(entityId, entityType, pageRequest));
    }

    @GetMapping("/latest")
    public ResponseEntity<List<CommentDTO>> getLatestComments(
            @RequestParam List<String> entityIds,
            @RequestParam EntityType entityType,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(commentService.getLatestComments(entityIds, entityType, limit));
    }

    @GetMapping("/count/entity/{entityId}")
    public ResponseEntity<Long> getCommentCount(
            @PathVariable String entityId,
            @RequestParam EntityType entityType) {
        return ResponseEntity.ok(commentService.getCommentCount(entityId, entityType));
    }

    @GetMapping("/count/replies/{commentId}")
    public ResponseEntity<Long> getReplyCount(@PathVariable Long commentId) {
        return ResponseEntity.ok(commentService.getReplyCount(commentId));
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> hasUserCommented(
            @RequestParam String entityId,
            @RequestParam EntityType entityType,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(commentService.hasUserCommented(entityId, entityType, userId));
    }

    @DeleteMapping("/entity/{entityId}")
    public ResponseEntity<Void> deleteAllCommentsByEntity(
            @PathVariable String entityId,
            @RequestParam EntityType entityType) {
        commentService.deleteAllCommentsByEntity(entityId, entityType);
        return ResponseEntity.noContent().build();
    }
} 