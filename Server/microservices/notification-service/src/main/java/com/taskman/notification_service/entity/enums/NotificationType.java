package com.taskman.notification_service.entity.enums;

public enum NotificationType {
    // Task related
    TASK_CREATED,
    TASK_ASSIGNED,
    TASK_UPDATED,
    TASK_COMPLETED,
    TASK_DUE_SOON,
    
    // Project related
    PROJECT_MEMBER_ADDED,
    PROJECT_UPDATED,
    PROJECT_COMPLETED,
    PROJECT_OVERDUE,
    PROJECT_DEADLINE_APPROACHING,
    PROJECT_MEMBER_ROLE_UPDATED,
    
    // Comment related
    COMMENT_ADDED,
    COMMENT_UPDATED,
} 