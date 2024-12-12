package com.taskman.project_service.service.impl;

import com.taskman.project_service.dao.interfaces.ProjectDao;
import com.taskman.project_service.dao.interfaces.ProjectMembershipDao;
import com.taskman.project_service.dto.ProjectDTO;
import com.taskman.project_service.dto.ProjectMembershipDTO;
import com.taskman.project_service.dto.request.CreateProjectRequest;
import com.taskman.project_service.dto.request.UpdateProjectRequest;
import com.taskman.project_service.entity.Project;
import com.taskman.project_service.entity.ProjectMembership;
import com.taskman.project_service.entity.enums.MemberRole;
import com.taskman.project_service.entity.enums.ProjectStatus;
import com.taskman.project_service.exception.ProjectAccessDeniedException;
import com.taskman.project_service.exception.ProjectNameAlreadyExistsException;
import com.taskman.project_service.exception.ProjectNotFoundException;
import com.taskman.project_service.service.interfaces.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectDao projectDao;
    private final ProjectMembershipDao membershipDao;

    @Override
    public ProjectDTO createProject(CreateProjectRequest request, String userId) {
        if (existsByName(request.getName())) {
            throw new ProjectNameAlreadyExistsException(request.getName());
        }

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(request.getStatus())
                .build();

        Project savedProject = projectDao.save(project);

        // Add creator as ADMIN member
        ProjectMembership membership = ProjectMembership.builder()
                .project(savedProject)
                .userId(userId)
                .role(MemberRole.ADMIN)
                .joinedAt(new Date())
                .build();

        membershipDao.save(membership);

        return convertToDTO(savedProject);
    }

    @Override
    public ProjectDTO getProjectById(Long id) {
        Project project = projectDao.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(id));
        return convertToDTO(project);
    }

    @Override
    public List<ProjectDTO> getAllProjects() {
        return projectDao.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectDTO updateProject(Long id, UpdateProjectRequest request) {
        Project project = projectDao.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(id));

        if (!project.getName().equals(request.getName()) && existsByName(request.getName())) {
            throw new ProjectNameAlreadyExistsException(request.getName());
        }

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setStatus(request.getStatus());

        Project updatedProject = projectDao.save(project);
        return convertToDTO(updatedProject);
    }

    @Override
    public void deleteProject(Long id) {
        if (!projectDao.existsById(id)) {
            throw new ProjectNotFoundException(id);
        }
        projectDao.deleteById(id);
    }

    @Override
    public List<ProjectDTO> findProjectsByName(String name) {
        return projectDao.findByName(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectDTO> findProjectsByStatus(ProjectStatus status) {
        return projectDao.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectDTO> findProjectsByUserId(String userId) {
        return projectDao.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProjectDTO> findProjectsByStatusAndUserId(ProjectStatus status, String userId) {
        return projectDao.findByStatusAndUserId(status, userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectMembershipDTO addMemberToProject(Long projectId, String userId, MemberRole role) {
        Project project = projectDao.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        if (isUserInProject(projectId, userId)) {
            throw new IllegalStateException("User is already a member of this project");
        }

        ProjectMembership membership = ProjectMembership.builder()
                .project(project)
                .userId(userId)
                .role(role)
                .joinedAt(new Date())
                .build();

        ProjectMembership savedMembership = membershipDao.save(membership);
        return convertMembershipToDTO(savedMembership);
    }

    @Override
    public void removeMemberFromProject(Long projectId, String userId) {
        membershipDao.deleteByProjectIdAndUserId(projectId, userId);
    }

    @Override
    public ProjectMembershipDTO updateMemberRole(Long projectId, String userId, MemberRole newRole) {
        ProjectMembership membership = membershipDao.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ProjectAccessDeniedException(userId, projectId));

        membership.setRole(newRole);
        ProjectMembership updatedMembership = membershipDao.save(membership);
        return convertMembershipToDTO(updatedMembership);
    }

    @Override
    public List<ProjectMembershipDTO> getProjectMembers(Long projectId) {
        return membershipDao.findByProjectId(projectId).stream()
                .map(this::convertMembershipToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isUserInProject(Long projectId, String userId) {
        return membershipDao.existsByProjectIdAndUserId(projectId, userId);
    }

    @Override
    public boolean existsByName(String name) {
        return projectDao.existsByName(name);
    }

    private ProjectDTO convertToDTO(Project project) {
        List<ProjectMembershipDTO> membershipDTOs = project.getMemberships().stream()
                .map(this::convertMembershipToDTO)
                .collect(Collectors.toList());

        return ProjectDTO.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .status(project.getStatus())
                .memberships(membershipDTOs)
                .build();
    }

    private ProjectMembershipDTO convertMembershipToDTO(ProjectMembership membership) {
        return ProjectMembershipDTO.builder()
                .id(membership.getId())
                .userId(membership.getUserId())
                .role(membership.getRole())
                .joinedAt(membership.getJoinedAt())
                .build();
    }
}