package com.taskman.comment_service.kafka.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEvent {
    private String eventType;  // UPDATED, DELETED
    private String userId;
    private String username;
    private String email;
}

