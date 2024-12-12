package com.taskman.project_service.service.interfaces;

import com.taskman.project_service.dto.ProjectDTO;
import com.taskman.project_service.dto.ProjectMembershipDTO;
import com.taskman.project_service.dto.request.CreateProjectRequest;
import com.taskman.project_service.dto.request.UpdateProjectRequest;
import com.taskman.project_service.entity.enums.MemberRole;
import com.taskman.project_service.entity.enums.ProjectStatus;

import java.util.List;

public interface ProjectService {
    // Project CRUD operations
    ProjectDTO createProject(CreateProjectRequest request, String userId);
    ProjectDTO getProjectById(Long id);
    List<ProjectDTO> getAllProjects();
    ProjectDTO updateProject(Long id, UpdateProjectRequest request, String userId);
    void deleteProject(Long id, String userId);

    // Project search and filter operations
    List<ProjectDTO> findProjectsByName(String name);
    List<ProjectDTO> findProjectsByStatus(ProjectStatus status);
    List<ProjectDTO> findProjectsByUserId(String userId);
    List<ProjectDTO> findProjectsByStatusAndUserId(ProjectStatus status, String userId);

    // Project membership operations
    ProjectMembershipDTO addMemberToProject(Long projectId, String userId, String targetUserId, MemberRole role);
    void removeMemberFromProject(Long projectId, String userId);
    ProjectMembershipDTO updateMemberRole(Long projectId, String userId, MemberRole newRole);
    List<ProjectMembershipDTO> getProjectMembers(Long projectId);

    // Validation operations
    boolean isUserInProject(Long projectId, String userId);
    boolean existsByName(String name);
}