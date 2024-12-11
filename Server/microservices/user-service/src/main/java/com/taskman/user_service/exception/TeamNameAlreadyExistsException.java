package com.taskman.user_service.exception;

import org.springframework.http.HttpStatus;

public class TeamNameAlreadyExistsException extends BaseException {
    public TeamNameAlreadyExistsException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}