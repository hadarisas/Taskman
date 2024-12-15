package com.taskman.notification_service.dao;

import com.taskman.notification_service.entity.Notification;
import com.taskman.notification_service.entity.enums.EntityType;
import com.taskman.notification_service.entity.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
public interface NotificationDao {
    Notification save(Notification notification);
    Optional<Notification> findById(Long id);
    Page<Notification> findByRecipientId(String recipientId, Pageable pageable);
    List<Notification> findAllByRecipientId(String recipientId);
    long countByRecipientId(String recipientId);
    List<Notification> findByEntityIdAndEntityType(String entityId, String entityType);
    void deleteById(Long id);
    long countUnreadByRecipientId(String recipientId);
    List<Notification> findUnreadByRecipientId(String recipientId);
    Page<Notification> findByRecipientIdAndIsRead(String recipientId, boolean isRead, Pageable pageable);
    Notification markAsRead(Long id);

    Page<Notification> findByRecipientIdAndType(String recipientId, NotificationType type, Pageable pageable);

    void deleteByEntityIdAndEntityType(String entityId, String entityType);
    void markAllAsRead(String recipientId);
    void deleteAllByRecipientId(String recipientId);
    List<Notification> findByRecipientIdAndType(String recipientId, NotificationType type);
}