package com.taskman.task_service.controller;

import com.taskman.task_service.dto.TaskAssignmentDTO;
import com.taskman.task_service.dto.request.AssignTaskRequest;
import com.taskman.task_service.security.JwtService;
import com.taskman.task_service.service.interfaces.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks/{taskId}/assignments")
@RequiredArgsConstructor
public class TaskAssignmentController {

    private final TaskService taskService;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<TaskAssignmentDTO> assignTask(
            @PathVariable Long taskId,
            @Valid @RequestBody AssignTaskRequest request,
            @RequestHeader("Authorization") String token) {
        String assignerId = jwtService.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(taskService.assignTask(taskId, assignerId, request.getUserId()));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> unassignTask(
            @PathVariable Long taskId,
            @PathVariable String userId,
            @RequestHeader("Authorization") String token) {
        String requesterId = jwtService.extractUserId(token.replace("Bearer ", ""));
        taskService.unassignTask(taskId, requesterId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<TaskAssignmentDTO>> getTaskAssignments(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.getTaskAssignments(taskId));
    }

    @GetMapping("/check/{userId}")
    public ResponseEntity<Boolean> checkAssignment(
            @PathVariable Long taskId,
            @PathVariable String userId) {
        return ResponseEntity.ok(taskService.isUserAssignedToTask(taskId, userId));
    }
} 