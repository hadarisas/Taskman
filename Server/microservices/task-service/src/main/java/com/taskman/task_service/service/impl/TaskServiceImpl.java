package com.taskman.task_service.service.impl;

import com.taskman.task_service.dao.interfaces.TaskDao;
import com.taskman.task_service.dao.interfaces.TaskAssignmentDao;
import com.taskman.task_service.dto.TaskDTO;
import com.taskman.task_service.dto.TaskAssignmentDTO;
import com.taskman.task_service.dto.request.CreateTaskRequest;
import com.taskman.task_service.dto.request.UpdateTaskRequest;
import com.taskman.task_service.entity.Task;
import com.taskman.task_service.entity.TaskAssignment;
import com.taskman.task_service.entity.enums.TaskStatus;
import com.taskman.task_service.exception.TaskAccessDeniedException;
import com.taskman.task_service.exception.TaskNotFoundException;
import com.taskman.task_service.exception.InvalidTaskAssignmentException;
import com.taskman.task_service.kafka.event.TaskEvent;
import com.taskman.task_service.service.interfaces.TaskService;
import com.taskman.task_service.kafka.producer.TaskEventProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskDao taskDao;
    private final TaskAssignmentDao taskAssignmentDao;
    private final TaskEventProducer taskEventProducer;

    @Override
    public TaskDTO createTask(CreateTaskRequest request, String userId) {
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(request.getStatus())
                .startDate(request.getStartDate())
                .dueDate(request.getDueDate())
                .projectId(request.getProjectId())
                .createdBy(userId)
                .build();

        Task savedTask = taskDao.save(task);
        
        TaskEvent event = TaskEvent.builder()
                .taskId(savedTask.getId().toString())
                .taskTitle(savedTask.getTitle())
                .projectId(savedTask.getProjectId())
                .description(savedTask.getDescription())
                .build();
        taskEventProducer.sendTaskCreatedEvent(event);

        return convertToDTO(savedTask);
    }

    @Override
    public TaskDTO getTaskById(Long id) {
        Task task = taskDao.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        return convertToDTO(task);
    }

    @Override
    public List<TaskDTO> getAllTasks() {
        return taskDao.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDTO updateTask(Long id, UpdateTaskRequest request, String userId) {
        Task task = taskDao.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        if (!canUserModifyTask(id, userId)) {
            throw new TaskAccessDeniedException(userId, id);
        }

        boolean hasChanges = false;
        
        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
            hasChanges = true;
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
            hasChanges = true;
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
            hasChanges = true;
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
            hasChanges = true;
        }
        if (request.getStartDate() != null) {
            task.setStartDate(request.getStartDate());
            hasChanges = true;
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
            hasChanges = true;
        }

        Task updatedTask = taskDao.save(task);
        
        if (hasChanges) {
            TaskEvent event = TaskEvent.builder()
                    .taskId(updatedTask.getId().toString())
                    .taskTitle(updatedTask.getTitle())
                    .projectId(updatedTask.getProjectId())
                    .description(updatedTask.getDescription())
                    .build();
            taskEventProducer.sendTaskUpdatedEvent(event);
        }

        return convertToDTO(updatedTask);
    }

    @Override
    public void deleteTask(Long id, String userId) {
        if (!canUserModifyTask(id, userId)) {
            throw new TaskAccessDeniedException(userId, id);
        }
        taskDao.deleteById(id);
    }

    @Override
    public List<TaskDTO> findTasksByProjectId(String projectId) {
        return taskDao.findByProjectId(projectId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> findTasksByStatus(TaskStatus status) {
        return taskDao.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> findTasksByUserId(String userId) {
        return taskDao.findTasksAssignedToUser(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> findTasksByProjectIdAndStatus(String projectId, TaskStatus status) {
        return taskDao.findByProjectIdAndStatus(projectId, status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDTO> findTasksByUserIdAndStatus(String userId, TaskStatus status) {
        return taskDao.findByUserIdAndStatus(userId, status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TaskAssignmentDTO assignTask(Long taskId, String assignerId, String assigneeId) {
        Task task = taskDao.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));

        if (!canUserModifyTask(taskId, assignerId)) {
            throw new TaskAccessDeniedException(assignerId, taskId);
        }

        if (taskAssignmentDao.existsByTaskIdAndUserIdAndActive(taskId, assigneeId)) {
            throw new InvalidTaskAssignmentException("User is already assigned to this task");
        }

        TaskAssignment assignment = TaskAssignment.builder()
                .task(task)
                .userId(assigneeId)
                .assignedBy(assignerId)
                .assignedAt(new Date())
                .build();

        TaskAssignment savedAssignment = taskAssignmentDao.save(assignment);

        TaskEvent event = TaskEvent.builder()
                .taskId(task.getId().toString())
                .taskTitle(task.getTitle())
                .assigneeId(assigneeId)
                .assignerId(assignerId)
                .projectId(task.getProjectId())
                .description(task.getDescription())
                .build();
        taskEventProducer.sendTaskAssignedEvent(event);

        return convertAssignmentToDTO(savedAssignment);
    }

    @Override
    public void unassignTask(Long taskId, String userId, String assigneeId) {
        if (!canUserModifyTask(taskId, userId)) {
            throw new TaskAccessDeniedException(userId, taskId);
        }

        TaskAssignment assignment = taskAssignmentDao.findActiveAssignment(taskId, assigneeId)
                .orElseThrow(() -> new InvalidTaskAssignmentException("No active assignment found"));

        assignment.setUnassignedAt(new Date());
        taskAssignmentDao.save(assignment);
    }

    @Override
    public List<TaskAssignmentDTO> getTaskAssignments(Long taskId) {
        return taskAssignmentDao.findByTaskId(taskId).stream()
                .map(this::convertAssignmentToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDTO updateTaskStatus(Long taskId, TaskStatus newStatus, String userId) {
        Task task = taskDao.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));

        if (!isUserAssignedToTask(taskId, userId)) {
            throw new TaskAccessDeniedException(userId, taskId);
        }

        task.setStatus(newStatus);
        Task updatedTask = taskDao.save(task);

        if (newStatus == TaskStatus.DONE) {
            TaskEvent event = TaskEvent.builder()
                    .taskId(task.getId().toString())
                    .taskTitle(task.getTitle())
                    .assigneeId(userId)
                    .projectId(task.getProjectId())
                    .description(task.getDescription())
                    .build();
            taskEventProducer.sendTaskCompletedEvent(event);
        }

        return convertToDTO(updatedTask);
    }

    @Override
    public boolean isUserAssignedToTask(Long taskId, String userId) {
        return taskDao.isUserAssignedToTask(taskId, userId);
    }

    @Override
    public boolean canUserModifyTask(Long taskId, String userId) {
        Task task = taskDao.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));
        return task.getCreatedBy().equals(userId) || isUserAssignedToTask(taskId, userId);
    }

    @Override
    public String getTaskOwner(Long taskId) {
        Task task = taskDao.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));
        return task.getCreatedBy();
    }

    private TaskDTO convertToDTO(Task task) {
        List<TaskAssignmentDTO> assignmentDTOs = task.getAssignments().stream()
                .map(this::convertAssignmentToDTO)
                .collect(Collectors.toList());

        return TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .status(task.getStatus())
                .startDate(task.getStartDate())
                .dueDate(task.getDueDate())
                .projectId(task.getProjectId())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .createdBy(task.getCreatedBy())
                .assignments(assignmentDTOs)
                .build();
    }

    private TaskAssignmentDTO convertAssignmentToDTO(TaskAssignment assignment) {
        return TaskAssignmentDTO.builder()
                .id(assignment.getId())
                .userId(assignment.getUserId())
                .assignedAt(assignment.getAssignedAt())
                .unassignedAt(assignment.getUnassignedAt())
                .assignedBy(assignment.getAssignedBy())
                .build();
    }
} 