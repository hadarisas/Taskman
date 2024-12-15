package com.taskman.project_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ProjectNameAlreadyExistsException extends RuntimeException {
    public ProjectNameAlreadyExistsException(String name) {
        super("Project with name '" + name + "' already exists");
    }
}
