package com.taskman.task_service.service.interfaces;

import com.taskman.task_service.dto.TaskDTO;
import com.taskman.task_service.dto.TaskAssignmentDTO;
import com.taskman.task_service.dto.request.CreateTaskRequest;
import com.taskman.task_service.dto.request.UpdateTaskRequest;
import com.taskman.task_service.entity.enums.TaskStatus;

import java.util.List;

public interface TaskService {
    // Task CRUD operations
    TaskDTO createTask(CreateTaskRequest request, String userId);
    TaskDTO getTaskById(Long id);
    List<TaskDTO> getAllTasks();
    TaskDTO updateTask(Long id, UpdateTaskRequest request, String userId);
    void deleteTask(Long id, String userId);

    // Task search and filter operations
    List<TaskDTO> findTasksByProjectId(String projectId);
    List<TaskDTO> findTasksByStatus(TaskStatus status);
    List<TaskDTO> findTasksByUserId(String userId);
    List<TaskDTO> findTasksByProjectIdAndStatus(String projectId, TaskStatus status);
    List<TaskDTO> findTasksByUserIdAndStatus(String userId, TaskStatus status);

    // Task assignment operations
    TaskAssignmentDTO assignTask(Long taskId, String assignerId, String assigneeId);
    void unassignTask(Long taskId, String userId, String assigneeId);
    List<TaskAssignmentDTO> getTaskAssignments(Long taskId);
    
    // Task status operations
    TaskDTO updateTaskStatus(Long taskId, TaskStatus newStatus, String userId);
    
    // Validation operations
    boolean isUserAssignedToTask(Long taskId, String userId);
    boolean canUserModifyTask(Long taskId, String userId);
} 