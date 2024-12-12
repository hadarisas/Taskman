package com.taskman.task_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class TaskAccessDeniedException extends RuntimeException {
    public TaskAccessDeniedException(String userId, Long taskId) {
        super("User " + userId + " does not have access to task " + taskId);
    }
} 