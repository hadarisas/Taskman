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
import com.taskman.project_service.kafka.event.TaskEvent;
import com.taskman.project_service.kafka.event.ProjectEvent;
import com.taskman.project_service.kafka.producer.ProjectEventProducer;
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
    private final ProjectEventProducer projectEventProducer;

    @Override
    @Transactional
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

        ProjectMembership membership = ProjectMembership.builder()
                .project(savedProject)
                .userId(userId)
                .role(MemberRole.ADMIN)
                .joinedAt(new Date())
                .build();

        membershipDao.save(membership);

        Long projectId = savedProject.getId();

        Project refreshedProject = projectDao.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        return convertToDTO(refreshedProject);
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
    public ProjectDTO updateProject(Long id, UpdateProjectRequest request, String userId) {
        Project project = projectDao.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(id));

        if (!isUserProjectAdmin(id, userId)) {
            throw new ProjectAccessDeniedException(userId, id);
        }

        boolean wasCompleted = ProjectStatus.COMPLETED.equals(request.getStatus())
                && !ProjectStatus.COMPLETED.equals(project.getStatus());

        if (request.getName() != null && !request.getName().equals(project.getName())) {
            if (existsByName(request.getName())) {
                throw new ProjectNameAlreadyExistsException(request.getName());
            }
            project.setName(request.getName());
        }
        if (request.getDescription() != null) {
            project.setDescription(request.getDescription());
        }
        if (request.getStartDate() != null) {
            project.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            project.setEndDate(request.getEndDate());
        }
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }

        Project updatedProject = projectDao.save(project);

        // Send appropriate event based on status change
        if (wasCompleted) {
            sendProjectCompletedEvent(updatedProject);
        } else {
            sendProjectUpdateEvent(updatedProject);
        }

        return convertToDTO(updatedProject);
    }

    @Override
    public void deleteProject(Long id, String userId) {
        Project project = projectDao.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(id));

        if (!isUserProjectAdmin(id, userId)) {
            throw new ProjectAccessDeniedException(userId, id);
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
    public ProjectMembershipDTO addMemberToProject(Long projectId, String userId, String targetUserId, MemberRole role) {
        Project project = projectDao.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        if (!isUserProjectAdmin(projectId, userId)) {
            throw new ProjectAccessDeniedException(userId, projectId);
        }

        if (isUserInProject(projectId, targetUserId)) {
            throw new IllegalStateException("User is already a member of this project");
        }

        ProjectMembership membership = ProjectMembership.builder()
                .project(project)
                .userId(targetUserId)
                .role(role)
                .joinedAt(new Date())
                .build();

        ProjectMembership savedMembership = membershipDao.save(membership);
        projectEventProducer.sendMemberAssignedEvent(project, targetUserId);
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

        MemberRole oldRole = membership.getRole();
        membership.setRole(newRole);
        ProjectMembership updatedMembership = membershipDao.save(membership);

        // Only send event if role actually changed
        if (!oldRole.equals(newRole)) {
            Project project = membership.getProject();
            ProjectEvent event = ProjectEvent.builder()
                    .eventType("PROJECT_MEMBER_ROLE_UPDATED")
                    .projectId(project.getId().toString())
                    .projectName(project.getName())
                    .userId(userId)
                    .role(newRole.toString())
                    .build();

            projectEventProducer.sendProjectEvent(event);
        }

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

    @Override
    @Transactional
    public void handleTaskCreated(TaskEvent event) {
        Project project = getProject(Long.valueOf(event.getProjectId()));
        project.setTotalTasks(project.getTotalTasks() + 1);

        if (ProjectStatus.NOT_STARTED.equals(project.getStatus())) {
            project.setStatus(ProjectStatus.IN_PROGRESS);

            // Send project status update event
            sendProjectStatusUpdateEvent(project);
        }

        updateProject(project);
    }

    @Override
    @Transactional
    public void handleTaskCompleted(TaskEvent event) {
        Project project = getProject(Long.valueOf(event.getProjectId()));
        project.setCompletedTasks(project.getCompletedTasks() + 1);

        if (project.getCompletedTasks().equals(project.getTotalTasks())) {
            project.setStatus(ProjectStatus.COMPLETED);

            // Send project completed event
            sendProjectStatusUpdateEvent(project);
        }

        updateProject(project);
    }

    @Override
    @Transactional
    public void handleTaskDeleted(TaskEvent event) {
        Project project = getProject(Long.valueOf(event.getProjectId()));
        project.setTotalTasks(project.getTotalTasks() - 1);

        if ("COMPLETED".equals(event.getEventType())) {
            project.setCompletedTasks(project.getCompletedTasks() - 1);
        }

        updateProjectStatus(project);
        updateProject(project);
    }

    @Override
    public Project getProject(Long id) {
        return projectDao.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(id));
    }

    @Override
    @Transactional
    public void updateProject(Project project) {
        projectDao.save(project);
    }


    // Helper methods
    private void updateProjectStatus(Project project) {
        ProjectStatus oldStatus = project.getStatus();
        ProjectStatus newStatus;

        if (project.getTotalTasks() == 0) {
            newStatus = ProjectStatus.NOT_STARTED;
        } else if (project.getCompletedTasks().equals(project.getTotalTasks())) {
            newStatus = ProjectStatus.COMPLETED;
        } else {
            newStatus = ProjectStatus.IN_PROGRESS;
        }

        if (oldStatus != newStatus) {
            project.setStatus(newStatus);
            sendProjectStatusUpdateEvent(project);
        }
    }

    private void sendProjectStatusUpdateEvent(Project project) {
        String managerId = project.getMemberships().stream()
                .filter(membership -> MemberRole.ADMIN.equals(membership.getRole()))
                .findFirst()
                .map(ProjectMembership::getUserId)
                .orElse(null);

        ProjectEvent event = ProjectEvent.builder()
                .eventType(ProjectStatus.COMPLETED.equals(project.getStatus())
                        ? "PROJECT_COMPLETED"
                        : "PROJECT_UPDATED")
                .projectId(String.valueOf(project.getId()))
                .projectName(project.getName())
                .description("Project status updated to: " + project.getStatus())
                .managerId(managerId)
                .status(project.getStatus().toString())
                .build();

        projectEventProducer.sendProjectEvent(event);
    }

    private boolean isUserProjectAdmin(Long projectId, String userId) {
        return membershipDao.findByProjectIdAndUserId(projectId, userId)
                .map(membership -> membership.getRole() == MemberRole.ADMIN)
                .orElse(false);
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

    private void sendProjectCompletedEvent(Project project) {
        List<String> memberIds = project.getMemberships().stream()
                .map(ProjectMembership::getUserId)
                .collect(Collectors.toList());

        ProjectEvent event = ProjectEvent.builder()
                .eventType("PROJECT_COMPLETED")
                .projectId(project.getId().toString())
                .projectName(project.getName())
                .status(project.getStatus().toString())
                .memberIds(memberIds)
                .build();

        projectEventProducer.sendProjectEvent(event);
    }

    private void sendProjectUpdateEvent(Project project) {
        List<String> memberIds = project.getMemberships().stream()
                .map(ProjectMembership::getUserId)
                .collect(Collectors.toList());

        ProjectEvent event = ProjectEvent.builder()
                .eventType("PROJECT_UPDATED")
                .projectId(project.getId().toString())
                .projectName(project.getName())
                .status(project.getStatus().toString())
                .memberIds(memberIds)
                .build();

        projectEventProducer.sendProjectEvent(event);
    }
}