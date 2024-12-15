package com.taskman.project_service.exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProjectMembershipNotFoundException extends RuntimeException {
    public ProjectMembershipNotFoundException(Long projectId, String userId) {
        super("Membership not found for user " + userId + " in project " + projectId);
    }
}
