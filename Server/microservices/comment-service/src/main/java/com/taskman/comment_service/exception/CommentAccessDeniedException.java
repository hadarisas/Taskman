package com.taskman.comment_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class CommentAccessDeniedException extends RuntimeException {
    public CommentAccessDeniedException(String userId, Long commentId) {
        super("User " + userId + " does not have permission to modify comment " + commentId);
    }
} 