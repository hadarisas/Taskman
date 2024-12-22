package com.taskman.project_service.kafka.consumer;

import com.taskman.project_service.dto.TaskEventDto;
import com.taskman.project_service.entity.Project;
import com.taskman.project_service.entity.enums.ProjectStatus;
import com.taskman.project_service.service.interfaces.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TaskEventConsumer {
    private final ProjectService projectService;

    @KafkaListener(
            topics = "${spring.kafka.topic.task-events}",
            containerFactory = "taskKafkaListenerContainerFactory"
    )
    public void handleTaskEvent(TaskEventDto event) {
        try {
            log.debug("Raw event received: {}", event);
            log.info("Processing task event of type: {}", event.getEventType());

            switch (event.getEventType()) {
                case "TASK_CREATED" -> handleTaskCreated(event);
                case "TASK_COMPLETED" -> handleTaskCompleted(event);
                case "TASK_DELETED" -> handleTaskDeleted(event);
                default -> log.warn("{} type will not be handled here", event.getEventType());
            }
        } catch (Exception e) {
            log.error("Error processing task event: {}", e.getMessage(), e);
        }
    }

    private void handleTaskCreated(TaskEventDto event) {
        try {
            projectService.handleTaskCreated(event);
            log.info("Successfully processed TASK_CREATED event for project: {}", event.getProjectId());
        } catch (Exception e) {
            log.error("Error handling task created event: {}", e.getMessage(), e);
        }
    }

    private void handleTaskCompleted(TaskEventDto event) {
        try {
            projectService.handleTaskCompleted(event);
            log.info("Successfully processed TASK_COMPLETED event for project: {}", event.getProjectId());
        } catch (Exception e) {
            log.error("Error handling task completed event: {}", e.getMessage(), e);
        }
    }

    private void handleTaskDeleted(TaskEventDto event) {
        try {
            projectService.handleTaskDeleted(event);
            log.info("Successfully processed TASK_DELETED event for project: {}", event.getProjectId());
        } catch (Exception e) {
            log.error("Error handling task deleted event: {}", e.getMessage(), e);
        }
    }
}
