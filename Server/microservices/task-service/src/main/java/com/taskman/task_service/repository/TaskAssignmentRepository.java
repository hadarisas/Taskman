package com.taskman.task_service.repository;

import com.taskman.task_service.entity.TaskAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskAssignmentRepository extends JpaRepository<TaskAssignment, Long> {

    @Query("SELECT ta FROM TaskAssignment ta WHERE ta.task.id = :taskId AND ta.userId = :userId AND ta.unassignedAt IS NULL")
    Optional<TaskAssignment> findActiveAssignment(@Param("taskId") Long taskId, @Param("userId") String userId);

    List<TaskAssignment> findByTaskId(Long taskId);

    @Query("SELECT ta FROM TaskAssignment ta WHERE ta.task.id = :taskId AND ta.unassignedAt IS NULL")
    List<TaskAssignment> findActiveAssignmentsByTaskId(@Param("taskId") Long taskId);

    @Query("SELECT ta FROM TaskAssignment ta WHERE ta.userId = :userId AND ta.unassignedAt IS NULL")
    List<TaskAssignment> findActiveAssignmentsByUserId(@Param("userId") String userId);

    void deleteByTaskIdAndUserId(Long taskId, String userId);

    boolean existsByTaskIdAndUserIdAndUnassignedAtIsNull(Long taskId, String userId);
}
