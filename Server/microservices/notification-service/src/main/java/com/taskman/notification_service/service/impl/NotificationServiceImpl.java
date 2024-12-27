package com.taskman.notification_service.service.impl;

import com.taskman.notification_service.dao.NotificationDao;
import com.taskman.notification_service.dto.NotificationDTO;
import com.taskman.notification_service.dto.request.CreateNotificationRequest;
import com.taskman.notification_service.dto.response.NotificationResponse;
import com.taskman.notification_service.dto.response.PagedNotificationResponse;
import com.taskman.notification_service.entity.Notification;
import com.taskman.notification_service.entity.enums.EntityType;
import com.taskman.notification_service.entity.enums.NotificationType;
import com.taskman.notification_service.exception.NotificationNotFoundException;
import com.taskman.notification_service.service.NotificationEmitterService;
import com.taskman.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationDao notificationDao;
    private final NotificationEmitterService emitterService;

    @Override
    public NotificationResponse createNotification(CreateNotificationRequest request) {
        Notification notification = Notification.builder()
                .type(request.getType())
                .content(request.getContent())
                .recipientId(request.getRecipientId())
                .entityId(request.getEntityId())
                .entityType(request.getEntityType())
                .build();

        NotificationResponse response = toResponse(notificationDao.save(notification));
        
        if (emitterService.hasEmitter(request.getRecipientId())) {
            emitterService.sendNotification(request.getRecipientId(), response);
        }
        
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationResponse getNotificationById(Long id) {
        return notificationDao.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new NotificationNotFoundException(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedNotificationResponse getNotificationsForUser(String userId, Pageable pageable) {
        Page<Notification> notificationsPage = notificationDao.findByRecipientId(userId, pageable);
        return toPagedResponse(notificationsPage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getAllNotificationsForUser(String userId) {
        return notificationDao.findAllByRecipientId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PagedNotificationResponse getNotificationsByType(String userId, NotificationType notificationType, Pageable pageable) {
        Page<Notification> notificationsPage = notificationDao.findByRecipientIdAndType(userId, notificationType, pageable);
        return toPagedResponse(notificationsPage);
    }



    @Override
    public NotificationResponse markAsRead(Long id) {
        return toResponse(notificationDao.markAsRead(id));
    }

    @Override
    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = notificationDao.findUnreadByRecipientId(userId);
        unreadNotifications.forEach(notification -> notificationDao.markAsRead(notification.getId()));
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(String userId) {
        return notificationDao.countUnreadByRecipientId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(String userId) {
        return notificationDao.findUnreadByRecipientId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteNotification(Long id) {
        notificationDao.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteAllByRecipientId(String userId) {
        notificationDao.deleteAllByRecipientId(userId);
    }

    @Override
    @Transactional
    public void deleteByEntityIdAndEntityType(String entityId, String entityType) {
        notificationDao.deleteByEntityIdAndEntityType(entityId, entityType);
    }

    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .content(notification.getContent())
                .recipientId(notification.getRecipientId())
                .entityId(notification.getEntityId())
                .entityType(notification.getEntityType())
                .isRead(notification.isRead())
                .readAt(notification.getReadAt())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    private PagedNotificationResponse toPagedResponse(Page<Notification> page) {
        List<NotificationResponse> notifications = page.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PagedNotificationResponse.builder()
                .notifications(notifications)
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
} 