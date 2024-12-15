package com.taskman.project_service.repository;

import com.taskman.project_service.entity.Project;
import com.taskman.project_service.entity.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    // Find projects by name
    List<Project> findByNameContainingIgnoreCase(String name);

    // Find projects by status
    List<Project> findByStatus(ProjectStatus status);

    // Check if project exists by name
    boolean existsByNameIgnoreCase(String name);

    // Find projects where user is a member
    List<Project> findByMemberships_UserId(String userId);

    // Find projects by status and user
    List<Project> findByStatusAndMemberships_UserId(ProjectStatus status, String userId);
}