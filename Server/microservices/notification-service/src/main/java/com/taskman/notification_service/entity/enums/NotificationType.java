package com.taskman.notification_service.entity.enums;

public enum NotificationType {
    // Task related
    TASK_CREATED,
    TASK_ASSIGNED,
    TASK_UPDATED,
    TASK_COMPLETED,
    TASK_DUE_SOON,
    
    // Project related
    PROJECT_CREATED,
    PROJECT_MEMBER_ADDED,
    PROJECT_UPDATED,
    PROJECT_COMPLETED,
    PROJECT_DELETED,
    
    // Comment related
    COMMENT_ADDED,
    COMMENT_REPLIED,
    COMMENT_UPDATED,
    
    // User related
    USER_MENTIONED
} 