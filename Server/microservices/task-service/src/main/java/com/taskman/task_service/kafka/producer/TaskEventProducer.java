package com.taskman.task_service.kafka.producer;

import com.taskman.task_service.kafka.event.TaskEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topic.task-events}")
    private String taskEventsTopic;

    public void sendTaskEvent(TaskEvent event) {
        try {
            log.info("Sending task event: {}", event);
            kafkaTemplate.send(taskEventsTopic, event.getTaskId(), event);
            log.info("Task event sent successfully");
        } catch (Exception e) {
            log.error("Error sending task event: {}", e.getMessage(), e);
        }
    }

    // different event types
    public void sendTaskCreatedEvent(TaskEvent event) {
        event.setEventType("TASK_CREATED");
        sendTaskEvent(event);
    }

    public void sendTaskUpdatedEvent(TaskEvent event) {
        event.setEventType("TASK_UPDATED");
        sendTaskEvent(event);
    }

    public void sendTaskAssignedEvent(TaskEvent event) {
        event.setEventType("TASK_ASSIGNED");
        sendTaskEvent(event);
    }

    public void sendTaskCompletedEvent(TaskEvent event) {
        event.setEventType("TASK_COMPLETED");
        sendTaskEvent(event);
    }
} 