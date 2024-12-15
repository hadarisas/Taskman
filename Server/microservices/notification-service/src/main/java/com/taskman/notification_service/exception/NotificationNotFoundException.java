package com.taskman.notification_service.exception;

public class NotificationNotFoundException extends NotificationException {
    public NotificationNotFoundException(Long id) {
        super("Notification not found with id: " + id);
    }
} 