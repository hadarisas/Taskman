package com.taskman.task_service.repository;

import com.taskman.task_service.entity.Task;
import com.taskman.task_service.entity.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(String projectId);

    List<Task> findByStatus(TaskStatus status);

    @Query("SELECT t FROM Task t JOIN t.assignments a WHERE a.userId = :userId AND a.unassignedAt IS NULL")
    List<Task> findTasksAssignedToUser(@Param("userId") String userId);

    @Query("SELECT t FROM Task t WHERE t.projectId = :projectId AND t.status = :status")
    List<Task> findByProjectIdAndStatus(@Param("projectId") String projectId, @Param("status") TaskStatus status);

    @Query("SELECT t FROM Task t JOIN t.assignments a " +
            "WHERE a.userId = :userId AND a.unassignedAt IS NULL AND t.status = :status")
    List<Task> findByUserIdAndStatus(@Param("userId") String userId, @Param("status") TaskStatus status);

    @Query("SELECT COUNT(t) > 0 FROM Task t JOIN t.assignments a " +
            "WHERE t.id = :taskId AND a.userId = :userId AND a.unassignedAt IS NULL")
    boolean isUserAssignedToTask(@Param("taskId") Long taskId, @Param("userId") String userId);
}