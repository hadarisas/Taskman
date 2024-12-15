package com.taskman.notification_service.dao.impl;

import com.taskman.notification_service.dao.NotificationDao;
import com.taskman.notification_service.entity.Notification;
import com.taskman.notification_service.entity.enums.EntityType;
import com.taskman.notification_service.entity.enums.NotificationType;
import com.taskman.notification_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Transactional
public class NotificationDaoImpl implements NotificationDao {

    private final NotificationRepository notificationRepository;

    @Override
    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Override
    public Optional<Notification> findById(Long id) {
        return notificationRepository.findById(id);
    }

    @Override
    public Page<Notification> findByRecipientId(String recipientId, Pageable pageable) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId, pageable);
    }

    @Override
    public List<Notification> findAllByRecipientId(String recipientId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId);
    }

    @Override
    public Page<Notification> findByRecipientIdAndType(String recipientId, NotificationType entityType, Pageable pageable) {
        return notificationRepository.findByRecipientIdAndTypeOrderByCreatedAtDesc(recipientId, entityType, pageable);
    }


    @Override
    public long countByRecipientId(String recipientId) {
        return notificationRepository.countByRecipientId(recipientId);
    }

    @Override
    public List<Notification> findByEntityIdAndEntityType(String entityId, String entityType) {
        return notificationRepository.findByEntityIdAndEntityType(entityId, entityType);
    }

    @Override
    public void deleteById(Long id) {
        notificationRepository.deleteById(id);
    }

    @Override
    public long countUnreadByRecipientId(String recipientId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(recipientId);
    }

    @Override
    public List<Notification> findUnreadByRecipientId(String recipientId) {
        return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(recipientId);
    }

    @Override
    public Page<Notification> findByRecipientIdAndIsRead(String recipientId, boolean isRead, Pageable pageable) {
        return notificationRepository.findByRecipientIdAndIsReadOrderByCreatedAtDesc(recipientId, isRead, pageable);
    }

    @Override
    public Notification markAsRead(Long id) {
        return notificationRepository.findById(id)
                .map(notification -> {
                    notification.setRead(true);
                    notification.setReadAt(LocalDateTime.now());
                    return notificationRepository.save(notification);
                })
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    @Override
    @Transactional
    public void deleteByEntityIdAndEntityType(String entityId, String entityType) {
        notificationRepository.deleteByEntityIdAndEntityType(entityId, entityType);
    }

    @Override
    @Transactional
    public void markAllAsRead(String recipientId) {
        List<Notification> unreadNotifications = notificationRepository.findByRecipientIdAndIsRead(
                recipientId, false);
        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
        });
    }

    @Override
    @Transactional
    public void deleteAllByRecipientId(String recipientId) {
        notificationRepository.deleteByRecipientId(recipientId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> findByRecipientIdAndType(String recipientId, NotificationType type) {
        return notificationRepository.findByRecipientIdAndType(recipientId, type);
    }
} 