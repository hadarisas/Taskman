package com.taskman.task_service.dao.impl;

import com.taskman.task_service.dao.interfaces.TaskDao;
import com.taskman.task_service.entity.Task;
import com.taskman.task_service.entity.enums.TaskStatus;
import com.taskman.task_service.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TaskDaoImpl implements TaskDao {

    private final TaskRepository taskRepository;

    @Override
    public Task save(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        taskRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return taskRepository.existsById(id);
    }

    @Override
    public List<Task> findByProjectId(String projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @Override
    public List<Task> findByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status);
    }

    @Override
    public List<Task> findTasksAssignedToUser(String userId) {
        return taskRepository.findTasksAssignedToUser(userId);
    }

    @Override
    public List<Task> findByProjectIdAndStatus(String projectId, TaskStatus status) {
        return taskRepository.findByProjectIdAndStatus(projectId, status);
    }

    @Override
    public List<Task> findByUserIdAndStatus(String userId, TaskStatus status) {
        return taskRepository.findByUserIdAndStatus(userId, status);
    }

    @Override
    public boolean isUserAssignedToTask(Long taskId, String userId) {
        return taskRepository.isUserAssignedToTask(taskId, userId);
    }
}