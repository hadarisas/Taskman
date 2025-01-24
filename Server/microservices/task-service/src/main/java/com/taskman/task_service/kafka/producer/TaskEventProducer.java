package com.taskman.task_service.kafka.producer;

import com.taskman.task_service.client.ProjectServiceClient;
import com.taskman.task_service.dao.interfaces.TaskDao;
import com.taskman.task_service.entity.Task;
import com.taskman.task_service.entity.TaskAssignment;
import com.taskman.task_service.entity.enums.TaskStatus;
import com.taskman.task_service.kafka.event.TaskEvent;
import com.taskman.task_service.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TaskEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ProjectServiceClient projectServiceClient;
    private final JwtService jwtService;
    private final TaskDao taskDao;

    @Value("${spring.kafka.topic.task-events}")
    private String topicName;


    public void sendTaskCreatedEvent(Task task) {
        try {
            String token = "Bearer " + jwtService.getSystemToken();


            List<String> projectAdmins = projectServiceClient.getProjectAdmins(task.getProjectId(), token);

            TaskEvent event = TaskEvent.builder()
                    .eventType("TASK_CREATED")
                    .taskId(task.getId().toString())
                    .taskTitle(task.getTitle())
                    .projectId(task.getProjectId())
                    .description(task.getDescription())
                    .status(task.getStatus().toString())
                    .priority(task.getPriority().toString())
                    .startDate(task.getStartDate())
                    .dueDate(task.getDueDate())
                    .timestamp(new Date())
                    .assigneeId(task.getCreatedBy())
                    .adminIds(projectAdmins)
                    .build();

            sendTaskEvent(event);
            log.info("Task assignment event sent for task: {}, created by: {}", task.getId(), task.getCreatedBy());
        } catch (Exception e) {
            log.error("Error sending task assignment event: {}", e.getMessage(), e);
        }
    }


    public void sendTaskAssignedEvent(Task task, String assigneeId) {
        try {
            String token = "Bearer " + jwtService.getSystemToken();


            List<String> projectAdmins = projectServiceClient.getProjectAdmins(task.getProjectId(), token);

            TaskEvent event = TaskEvent.builder()
                    .eventType("TASK_ASSIGNED")
                    .taskId(task.getId().toString())
                    .taskTitle(task.getTitle())
                    .projectId(task.getProjectId())
                    .description(task.getDescription())
                    .status(task.getStatus().toString())
                    .priority(task.getPriority().toString())
                    .startDate(task.getStartDate())
                    .dueDate(task.getDueDate())
                    .timestamp(new Date())
                    .assigneeId(assigneeId)
                    .adminIds(projectAdmins)
                    .build();

            sendTaskEvent(event);
            log.info("Task assignment event sent for task: {}, assignee: {}", task.getId(), assigneeId);
        } catch (Exception e) {
            log.error("Error sending task assignment event: {}", e.getMessage(), e);
        }
    }


    public void sendTaskUpdatedEvent(Task task) {
        try {
            List<String> assigneeIds = task.getAssignments().stream()
                    .map(TaskAssignment::getUserId)
                    .collect(Collectors.toList());

            String token = "Bearer " + jwtService.getSystemToken();


            List<String> projectAdmins = projectServiceClient.getProjectAdmins(task.getProjectId(), token);


            TaskEvent event = TaskEvent.builder()
                    .eventType("TASK_UPDATED")
                    .taskId(task.getId().toString())
                    .taskTitle(task.getTitle())
                    .projectId(task.getProjectId())
                    .description(task.getDescription())
                    .status(task.getStatus().toString())
                    .priority(task.getPriority().toString())
                    .startDate(task.getStartDate())
                    .dueDate(task.getDueDate())
                    .timestamp(new Date())
                    .assigneeIds(assigneeIds)
                    .adminIds(projectAdmins)
                    .build();

            sendTaskEvent(event);
            log.info("Task update event sent for task: {}", task.getId());
        } catch (Exception e) {
            log.error("Error sending task update event: {}", e.getMessage(), e);
        }
    }


    public void sendTaskCompletedEvent(Task task) {
        try {
            List<String> assigneeIds = task.getAssignments().stream()
                    .map(TaskAssignment::getUserId)
                    .collect(Collectors.toList());

            String token = "Bearer " + jwtService.getSystemToken();


            List<String> projectAdmins = projectServiceClient.getProjectAdmins(task.getProjectId(), token);



            TaskEvent event = TaskEvent.builder()
                    .eventType("TASK_COMPLETED")
                    .taskId(task.getId().toString())
                    .taskTitle(task.getTitle())
                    .projectId(task.getProjectId())
                    .description(task.getDescription())
                    .status(task.getStatus().toString())
                    .priority(task.getPriority().toString())
                    .startDate(task.getStartDate())
                    .dueDate(task.getDueDate())
                    .timestamp(new Date())
                    .assigneeIds(assigneeIds)
                    .adminIds(projectAdmins)
                    .build();

            sendTaskEvent(event);
            log.info("Task completion event sent for task: {}", task.getId());
        } catch (Exception e) {
            log.error("Error sending task completion event: {}", e.getMessage(), e);
        }
    }

    @Scheduled(cron = "0 0 0 * * ?") // Run daily at midnight
    @Transactional(readOnly = true)
    public void checkTaskDeadlines() {
        log.info("Checking task deadlines...");
        List<Task> tasks = taskDao.findAll();
        LocalDate today = LocalDate.now();
        String token = "Bearer " + jwtService.getSystemToken();




        for (Task task : tasks) {
            if (task.getDueDate() == null || task.getStatus() == TaskStatus.DONE) {
                continue;
            }
            List<String> projectAdmins = projectServiceClient.getProjectAdmins(task.getProjectId(), token);


            LocalDate dueDate = task.getDueDate().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();

            long daysUntilDue = ChronoUnit.DAYS.between(today, dueDate);

            List<String> assigneeIds = task.getAssignments().stream()
                    .map(TaskAssignment::getUserId)
                    .collect(Collectors.toList());

            if (daysUntilDue < 0) {
                sendTaskOverdueEvent(task, assigneeIds, projectAdmins);
            } else if (daysUntilDue <= 3) {
                sendTaskDeadlineApproachingEvent(task, assigneeIds, projectAdmins);
            }
        }
    }

    private void sendTaskOverdueEvent(Task task, List<String> assigneeIds, List<String> projectAdmins) {
        try {
            TaskEvent event = TaskEvent.builder()
                    .eventType("TASK_OVERDUE")
                    .taskId(task.getId().toString())
                    .taskTitle(task.getTitle())
                    .projectId(task.getProjectId())
                    .description(task.getDescription())
                    .status(task.getStatus().toString())
                    .priority(task.getPriority().toString())
                    .dueDate(task.getDueDate())
                    .timestamp(new Date())
                    .assigneeIds(assigneeIds)
                    .adminIds(projectAdmins)
                    .build();

            sendTaskEvent(event);
            log.info("Task overdue event sent for task: {}", task.getId());
        } catch (Exception e) {
            log.error("Error sending task overdue event: {}", e.getMessage(), e);
        }
    }

    private void sendTaskDeadlineApproachingEvent(Task task, List<String> assigneeIds, List<String> projectAdmins) {
        try {
            TaskEvent event = TaskEvent.builder()
                    .eventType("TASK_DEADLINE_APPROACHING")
                    .taskId(task.getId().toString())
                    .taskTitle(task.getTitle())
                    .projectId(task.getProjectId())
                    .description(task.getDescription())
                    .status(task.getStatus().toString())
                    .priority(task.getPriority().toString())
                    .dueDate(task.getDueDate())
                    .timestamp(new Date())
                    .assigneeIds(assigneeIds)
                    .adminIds(projectAdmins)
                    .build();

            sendTaskEvent(event);
            log.info("Task deadline approaching event sent for task: {}", task.getId());
        } catch (Exception e) {
            log.error("Error sending task deadline approaching event: {}", e.getMessage(), e);
        }
    }

    private void sendTaskEvent(TaskEvent event) {
        log.info("Sending task event: {}", event);
        try {
            kafkaTemplate.send(topicName, event);
        } catch (Exception e) {
            log.error("Error sending task event: {}", e.getMessage(), e);
        }
    }
} 