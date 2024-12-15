package com.taskman.notification_service.service;

import com.taskman.notification_service.dto.NotificationDTO;
import com.taskman.notification_service.dto.request.CreateNotificationRequest;
import com.taskman.notification_service.dto.response.NotificationResponse;
import com.taskman.notification_service.dto.response.PagedNotificationResponse;
import com.taskman.notification_service.entity.enums.EntityType;
import com.taskman.notification_service.entity.enums.NotificationType;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {
    NotificationResponse createNotification(CreateNotificationRequest request);

    NotificationResponse getNotificationById(Long id);

    PagedNotificationResponse getNotificationsForUser(String userId, Pageable pageable);

    List<NotificationResponse> getAllNotificationsForUser(String userId);

    PagedNotificationResponse getNotificationsByType(String userId, NotificationType notificationType, Pageable pageable);

    NotificationResponse markAsRead(Long id);

    void markAllAsRead(String userId);

    long getUnreadCount(String userId);

    List<NotificationResponse> getUnreadNotifications(String userId);

    void deleteNotification(Long id);

    void deleteAllByRecipientId(String userId);

    void deleteByEntityIdAndEntityType(String entityId, String entityType);
}