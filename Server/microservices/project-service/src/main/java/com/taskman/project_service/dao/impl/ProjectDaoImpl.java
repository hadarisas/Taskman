package com.taskman.project_service.dao.impl;

import com.taskman.project_service.dao.interfaces.ProjectDao;
import com.taskman.project_service.entity.Project;
import com.taskman.project_service.entity.enums.ProjectStatus;
import com.taskman.project_service.exception.ProjectNotFoundException;
import com.taskman.project_service.repository.ProjectRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProjectDaoImpl extends BaseDaoImpl<Project, Long> implements ProjectDao {

    private final ProjectRepository projectRepository;

    public ProjectDaoImpl(ProjectRepository projectRepository) {
        super(Project.class);
        this.projectRepository = projectRepository;
    }

    @Override
    public List<Project> findByName(String name) {
        return projectRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Project> findByStatus(ProjectStatus status) {
        return projectRepository.findByStatus(status);
    }

    @Override
    public List<Project> findByUserId(String userId) {
        return projectRepository.findByMemberships_UserId(userId);
    }

    @Override
    public List<Project> findByStatusAndUserId(ProjectStatus status, String userId) {
        return projectRepository.findByStatusAndMemberships_UserId(status, userId);
    }

    @Override
    public boolean existsByName(String name) {
        return projectRepository.existsByNameIgnoreCase(name);
    }

    @Override
    public boolean areAllTasksCompleted(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));
                
        return project.getTotalTasks() > 0 && 
               project.getTotalTasks().equals(project.getCompletedTasks());
    }
}