package com.taskman.task_service.dao.interfaces;


import com.taskman.task_service.entity.Task;
import com.taskman.task_service.entity.enums.TaskStatus;

import java.util.List;
import java.util.Optional;

public interface TaskDao {
    Task save(Task task);
    Optional<Task> findById(Long id);
    List<Task> findAll();
    void deleteById(Long id);
    boolean existsById(Long id);

    List<Task> findByProjectId(String projectId);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findTasksAssignedToUser(String userId);
    List<Task> findByProjectIdAndStatus(String projectId, TaskStatus status);
    List<Task> findByUserIdAndStatus(String userId, TaskStatus status);
    boolean isUserAssignedToTask(Long taskId, String userId);
}
