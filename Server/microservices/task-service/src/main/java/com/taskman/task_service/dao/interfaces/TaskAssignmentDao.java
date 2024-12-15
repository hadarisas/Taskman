package com.taskman.task_service.dao.interfaces;

import com.taskman.task_service.entity.TaskAssignment;

import java.util.List;
import java.util.Optional;

public interface TaskAssignmentDao {
    TaskAssignment save(TaskAssignment assignment);
    Optional<TaskAssignment> findById(Long id);
    void deleteById(Long id);

    Optional<TaskAssignment> findActiveAssignment(Long taskId, String userId);
    List<TaskAssignment> findByTaskId(Long taskId);
    List<TaskAssignment> findActiveAssignmentsByTaskId(Long taskId);
    List<TaskAssignment> findActiveAssignmentsByUserId(String userId);
    void deleteByTaskIdAndUserId(Long taskId, String userId);
    boolean existsByTaskIdAndUserIdAndActive(Long taskId, String userId);
}
