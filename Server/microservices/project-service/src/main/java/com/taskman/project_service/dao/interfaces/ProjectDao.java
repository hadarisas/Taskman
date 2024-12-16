package com.taskman.project_service.dao.interfaces;

import com.taskman.project_service.entity.Project;
import com.taskman.project_service.entity.enums.ProjectStatus;

import java.util.List;
import java.util.Optional;

public interface ProjectDao extends BaseDao<Project, Long> {
    List<Project> findByName(String name);
    List<Project> findByStatus(ProjectStatus status);
    List<Project> findByUserId(String userId);
    List<Project> findByStatusAndUserId(ProjectStatus status, String userId);
    boolean existsByName(String name);
    boolean areAllTasksCompleted(Long projectId);

}