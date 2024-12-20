package com.taskman.task_service.controller;

import com.taskman.task_service.dto.TaskDTO;
import com.taskman.task_service.dto.TaskNotificationRecipientsDto;
import com.taskman.task_service.dto.request.CreateTaskRequest;
import com.taskman.task_service.dto.request.UpdateTaskRequest;
import com.taskman.task_service.entity.enums.TaskStatus;
import com.taskman.task_service.security.JwtService;
import com.taskman.task_service.service.interfaces.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(
            @Valid @RequestBody CreateTaskRequest request,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        return new ResponseEntity<>(taskService.createTask(request, userId), HttpStatus.CREATED);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskDTO> getTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.getTaskById(taskId));
    }

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String userId) {

        if (projectId != null && status != null) {
            return ResponseEntity.ok(taskService.findTasksByProjectIdAndStatus(projectId, status));
        }
        if (userId != null && status != null) {
            return ResponseEntity.ok(taskService.findTasksByUserIdAndStatus(userId, status));
        }
        if (projectId != null) {
            return ResponseEntity.ok(taskService.findTasksByProjectId(projectId));
        }
        if (status != null) {
            return ResponseEntity.ok(taskService.findTasksByStatus(status));
        }
        if (userId != null) {
            return ResponseEntity.ok(taskService.findTasksByUserId(userId));
        }

        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskDTO> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(taskService.updateTask(taskId, request, userId));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        taskService.deleteTask(taskId, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<TaskDTO> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestParam TaskStatus status,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, status, userId));
    }

    @GetMapping("/{taskId}/owner")
    public ResponseEntity<String> getTaskOwner(@PathVariable Long taskId) {
        String ownerId = taskService.getTaskOwner(taskId);
        return ResponseEntity.ok(ownerId);
    }
    @GetMapping("/{taskId}/notification-recipients")
    public ResponseEntity<TaskNotificationRecipientsDto> getTaskNotificationRecipients(@PathVariable Long taskId) {
        TaskNotificationRecipientsDto recipients = taskService.getTaskNotificationRecipients(taskId);
        return ResponseEntity.ok(recipients);
    }

} 