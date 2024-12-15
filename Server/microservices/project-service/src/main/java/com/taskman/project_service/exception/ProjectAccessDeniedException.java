package com.taskman.project_service.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class ProjectAccessDeniedException extends RuntimeException {
    public ProjectAccessDeniedException(String userId, Long projectId) {
        super("User " + userId + " does not have access to project " + projectId);
    }
}