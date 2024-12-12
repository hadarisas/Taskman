package com.taskman.project_service.controller;

import com.taskman.project_service.dto.ProjectDTO;
import com.taskman.project_service.dto.request.CreateProjectRequest;
import com.taskman.project_service.dto.request.UpdateProjectRequest;
import com.taskman.project_service.entity.enums.ProjectStatus;
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

    // Constructor injection
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            @RequestHeader("X-User-Id") String userId) {
        return new ResponseEntity<>(projectService.createProject(request, userId), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
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

    @GetMapping("/check-name")
    public ResponseEntity<Boolean> checkNameExists(@RequestParam String name) {
        return ResponseEntity.ok(projectService.existsByName(name));
    }
}