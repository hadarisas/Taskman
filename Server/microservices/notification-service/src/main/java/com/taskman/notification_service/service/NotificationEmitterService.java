package com.taskman.notification_service.service;

import com.taskman.notification_service.dto.response.NotificationResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class NotificationEmitterService {
    
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter createEmitter(String userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        
        emitter.onCompletion(() -> {
            log.info("SSE connection completed for user: {}", userId);
            emitters.remove(userId);
        });
        
        emitter.onTimeout(() -> {
            log.info("SSE connection timeout for user: {}", userId);
            emitter.complete();
            emitters.remove(userId);
        });
        
        emitter.onError(e -> {
            log.error("SSE error for user: {}", userId, e);
            emitter.complete();
            emitters.remove(userId);
        });
        
        emitters.put(userId, emitter);
        return emitter;
    }

    public void sendNotification(String userId, NotificationResponse notification) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("notification")
                        .data(notification));
            } catch (IOException e) {
                log.error("Error sending notification to user: {}", userId, e);
                emitter.complete();
                emitters.remove(userId);
            }
        }
    }

    public void removeEmitter(String userId) {
        SseEmitter emitter = emitters.remove(userId);
        if (emitter != null) {
            emitter.complete();
        }
    }

    public boolean hasEmitter(String userId) {
        return emitters.containsKey(userId);
    }
} 