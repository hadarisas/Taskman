package com.taskman.project_service.controller;

import com.taskman.project_service.dto.ProjectDTO;
import com.taskman.project_service.dto.ProjectMembershipDTO;
import com.taskman.project_service.dto.request.CreateProjectRequest;
import com.taskman.project_service.dto.request.UpdateProjectRequest;
import com.taskman.project_service.entity.enums.MemberRole;
import com.taskman.project_service.entity.enums.ProjectStatus;
import com.taskman.project_service.security.JwtService;
import com.taskman.project_service.service.interfaces.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final JwtService jwtService;

    public ProjectController(ProjectService projectService, JwtService jwtService) {
        this.projectService = projectService;
        this.jwtService = jwtService;
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        return new ResponseEntity<>(projectService.createProject(request, userId), HttpStatus.CREATED);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDTO> getProject(
            @PathVariable("projectId") Long projectId,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(projectService.getProjectById(projectId));
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(projectService.updateProject(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        projectService.deleteProject(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProjectDTO>> searchProjects(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) ProjectStatus status,
            @RequestParam(required = false) String userId) {

        if (name != null) {
            return ResponseEntity.ok(projectService.findProjectsByName(name));
        }
        if (status != null && userId != null) {
            return ResponseEntity.ok(projectService.findProjectsByStatusAndUserId(status, userId));
        }
        if (status != null) {
            return ResponseEntity.ok(projectService.findProjectsByStatus(status));
        }
        if (userId != null) {
            return ResponseEntity.ok(projectService.findProjectsByUserId(userId));
        }

        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @PostMapping("/{projectId}/members")
    public ResponseEntity<ProjectMembershipDTO> addMemberToProject(
            @PathVariable Long projectId,
            @RequestParam String targetUserId,
            @RequestParam MemberRole role,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(projectService.addMemberToProject(projectId, userId, targetUserId, role));
    }
    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<ProjectMembershipDTO>> getMembers(
            @PathVariable Long projectId,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(projectService.getProjectMembers(projectId));
    }

    @DeleteMapping("/{projectId}/members/{memberId}")
    public ResponseEntity<Void> removeMemberFromProject(
            @PathVariable Long projectId,
            @PathVariable String memberId,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        projectService.removeMemberFromProject(projectId, memberId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check-name")
    public ResponseEntity<Boolean> checkNameExists(@RequestParam String name) {
        return ResponseEntity.ok(projectService.existsByName(name));
    }
}