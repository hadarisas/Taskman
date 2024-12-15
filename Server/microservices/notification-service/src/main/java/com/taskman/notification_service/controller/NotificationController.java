package com.taskman.notification_service.controller;

import com.taskman.notification_service.dto.request.CreateNotificationRequest;
import com.taskman.notification_service.dto.response.NotificationResponse;
import com.taskman.notification_service.dto.response.PagedNotificationResponse;
import com.taskman.notification_service.entity.enums.NotificationType;
import com.taskman.notification_service.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification Controller", description = "Endpoints for managing notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    @Operation(summary = "Create a new notification")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificationResponse> createNotification(
            @Valid @RequestBody CreateNotificationRequest request
    ) {
        return new ResponseEntity<>(notificationService.createNotification(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get notification by ID")
    public ResponseEntity<NotificationResponse> getNotification(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.getNotificationById(id));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get paginated notifications for a user")
    public ResponseEntity<PagedNotificationResponse> getUserNotifications(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userId, pageable));
    }

    @GetMapping("/user/{userId}/all")
    @Operation(summary = "Get all notifications for a user")
    public ResponseEntity<List<NotificationResponse>> getAllUserNotifications(
            @PathVariable String userId
    ) {
        return ResponseEntity.ok(notificationService.getAllNotificationsForUser(userId));
    }

    @GetMapping("/user/{userId}/unread")
    @Operation(summary = "Get unread notifications for a user")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(
            @PathVariable String userId
    ) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    @GetMapping("/user/{userId}/unread/count")
    @Operation(summary = "Get count of unread notifications for a user")
    public ResponseEntity<Long> getUnreadCount(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getUnreadCount(userId));
    }

    @GetMapping("/user/{userId}/type/{notificationType}")
    @Operation(summary = "Get notifications by type for a user")
    public ResponseEntity<PagedNotificationResponse> getNotificationsByType(
            @PathVariable String userId,
            @PathVariable NotificationType notificationType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(notificationService.getNotificationsByType(userId, notificationType, pageable));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @PatchMapping("/user/{userId}/read/all")
    @Operation(summary = "Mark all notifications as read for a user")
    public ResponseEntity<Void> markAllAsRead(@PathVariable String userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a notification")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{userId}")
    @Operation(summary = "Delete all notifications for a user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAllUserNotifications(@PathVariable String userId) {
        notificationService.deleteAllByRecipientId(userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/entity/{entityType}/{entityId}")
    @Operation(summary = "Delete all notifications for an entity")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEntityNotifications(
            @PathVariable String entityType,
            @PathVariable String entityId
    ) {
        notificationService.deleteByEntityIdAndEntityType(entityId, entityType);
        return ResponseEntity.noContent().build();
    }
} 