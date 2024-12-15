package com.taskman.task_service.dao.impl;

import com.taskman.task_service.dao.interfaces.TaskAssignmentDao;
import com.taskman.task_service.entity.TaskAssignment;
import com.taskman.task_service.repository.TaskAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TaskAssignmentDaoImpl implements TaskAssignmentDao {

    private final TaskAssignmentRepository taskAssignmentRepository;

    @Override
    public TaskAssignment save(TaskAssignment assignment) {
        return taskAssignmentRepository.save(assignment);
    }

    @Override
    public Optional<TaskAssignment> findById(Long id) {
        return taskAssignmentRepository.findById(id);
    }

    @Override
    public void deleteById(Long id) {
        taskAssignmentRepository.deleteById(id);
    }

    @Override
    public Optional<TaskAssignment> findActiveAssignment(Long taskId, String userId) {
        return taskAssignmentRepository.findActiveAssignment(taskId, userId);
    }

    @Override
    public List<TaskAssignment> findByTaskId(Long taskId) {
        return taskAssignmentRepository.findByTaskId(taskId);
    }

    @Override
    public List<TaskAssignment> findActiveAssignmentsByTaskId(Long taskId) {
        return taskAssignmentRepository.findActiveAssignmentsByTaskId(taskId);
    }

    @Override
    public List<TaskAssignment> findActiveAssignmentsByUserId(String userId) {
        return taskAssignmentRepository.findActiveAssignmentsByUserId(userId);
    }

    @Override
    public void deleteByTaskIdAndUserId(Long taskId, String userId) {
        taskAssignmentRepository.deleteByTaskIdAndUserId(taskId, userId);
    }

    @Override
    public boolean existsByTaskIdAndUserIdAndActive(Long taskId, String userId) {
        return taskAssignmentRepository.existsByTaskIdAndUserIdAndUnassignedAtIsNull(taskId, userId);
    }
}
