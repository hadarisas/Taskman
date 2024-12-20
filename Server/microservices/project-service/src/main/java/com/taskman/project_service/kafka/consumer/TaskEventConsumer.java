package com.taskman.project_service.kafka.consumer;

import com.taskman.project_service.entity.Project;
import com.taskman.project_service.entity.enums.ProjectStatus;
import com.taskman.project_service.kafka.event.TaskEvent;
import com.taskman.project_service.service.interfaces.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskEventConsumer {

    private final ProjectService projectService;

    @KafkaListener(
            topics = "${spring.kafka.topic.task-events}",
            containerFactory = "taskKafkaListenerContainerFactory"
    )
    public void consume(TaskEvent event) {
        log.info("Task event received => {}", event.toString());
        /*
        switch (event.getEventType()) {
            case "TASK_CREATED" -> handleTaskCreated(event);
            case "TASK_COMPLETED" -> handleTaskCompleted(event);
            case "TASK_DELETED" -> handleTaskDeleted(event);
            default -> log.warn("Unhandled event type: {}", event.getEventType());
        }
        */
    }

    private void handleTaskCreated(TaskEvent event) {
        Project project = projectService.getProject(Long.valueOf(event.getProjectId()));
        project.setTotalTasks(project.getTotalTasks() + 1);
        
        // If project was NOT_STARTED, change to IN_PROGRESS
        if (ProjectStatus.NOT_STARTED.equals(project.getStatus())) {
            project.setStatus(ProjectStatus.IN_PROGRESS);
        }
        
        projectService.updateProject(project);
    }

    private void handleTaskCompleted(TaskEvent event) {
        Project project = projectService.getProject(Long.valueOf(event.getProjectId()));
        project.setCompletedTasks(project.getCompletedTasks() + 1);
        
        // Check if all tasks are completed
        if (project.getCompletedTasks().equals(project.getTotalTasks())) {
            project.setStatus(ProjectStatus.COMPLETED);
        }
        
        projectService.updateProject(project);
    }

    private void handleTaskDeleted(TaskEvent event) {
        Project project = projectService.getProject(Long.valueOf(event.getProjectId()));
        project.setTotalTasks(project.getTotalTasks() - 1);
        
        // If this was a completed task, decrease completed count
        if ("COMPLETED".equals(event.getEventType())) {
            project.setCompletedTasks(project.getCompletedTasks() - 1);
        }
        
        // Recheck project status
        if (project.getTotalTasks() == 0) {
            project.setStatus(ProjectStatus.NOT_STARTED);
        } else if (!project.getCompletedTasks().equals(project.getTotalTasks())) {
            project.setStatus(ProjectStatus.IN_PROGRESS);
        }
        
        projectService.updateProject(project);
    }
} 