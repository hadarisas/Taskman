package com.taskman.notification_service.controller;

import com.taskman.notification_service.service.NotificationEmitterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/notifications/stream")
@RequiredArgsConstructor
public class NotificationStreamController {

    private final NotificationEmitterService emitterService;

    @GetMapping(value = "/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamNotifications(@PathVariable String userId) {
        return emitterService.createEmitter(userId);
    }

    @DeleteMapping("/{userId}")
    public void closeConnection(@PathVariable String userId) {
        emitterService.removeEmitter(userId);
    }
} 