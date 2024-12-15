package com.taskman.notification_service.repository;

import com.taskman.notification_service.entity.Notification;
import com.taskman.notification_service.entity.enums.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Find notifications for a specific recipient with pagination
    Page<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId, Pageable pageable);
    
    // Find all notifications for a specific recipient
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId);
    
    // Find notifications by type and recipient
    Page<Notification> findByRecipientIdAndEntityTypeOrderByCreatedAtDesc(
            String recipientId,
            NotificationType entityType,
            Pageable pageable
    );
    
    // Count unread notifications for a recipient
    long countByRecipientId(String recipientId);
    
    // Find notifications related to a specific entity
    List<Notification> findByEntityIdAndEntityType(String entityId, String entityType);
    
    // Count unread notifications for a recipient
    long countByRecipientIdAndIsReadFalse(String recipientId);
    
    // Find unread notifications for a recipient
    List<Notification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(String recipientId);
    Page<Notification> findByRecipientIdAndTypeOrderByCreatedAtDesc(String recipientId, NotificationType type, Pageable pageable);
    
    // Find notifications by read status
    Page<Notification> findByRecipientIdAndIsReadOrderByCreatedAtDesc(
        String recipientId, 
        boolean isRead, 
        Pageable pageable
    );
    
    void deleteByEntityIdAndEntityType(String entityId, String entityType);
    void deleteByRecipientId(String recipientId);
    List<Notification> findByRecipientIdAndIsRead(String recipientId, boolean isRead);
    List<Notification> findByRecipientIdAndType(String recipientId, NotificationType type);
} 