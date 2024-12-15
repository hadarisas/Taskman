package com.taskman.task_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TaskAssignmentNotFoundException extends RuntimeException {
    public TaskAssignmentNotFoundException(Long taskId, String userId) {
        super("Task assignment not found for task " + taskId + " and user " + userId);
    }
} 