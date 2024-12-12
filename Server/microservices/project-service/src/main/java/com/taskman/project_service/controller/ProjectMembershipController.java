package com.taskman.project_service.controller;

import com.taskman.project_service.dto.ProjectMembershipDTO;
import com.taskman.project_service.entity.enums.MemberRole;
import com.taskman.project_service.service.interfaces.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/members")
public class ProjectMembershipController {

    private final ProjectService projectService;

    // Constructor injection
    public ProjectMembershipController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<ProjectMembershipDTO> addMember(
            @PathVariable Long projectId,
            @PathVariable String userId,
            @RequestParam MemberRole role) {
        return ResponseEntity.ok(projectService.addMemberToProject(projectId, userId, role));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long projectId,
            @PathVariable String userId) {
        projectService.removeMemberFromProject(projectId, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<ProjectMembershipDTO> updateMemberRole(
            @PathVariable Long projectId,
            @PathVariable String userId,
            @RequestParam MemberRole role) {
        return ResponseEntity.ok(projectService.updateMemberRole(projectId, userId, role));
    }

    @GetMapping
    public ResponseEntity<List<ProjectMembershipDTO>> getMembers(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getProjectMembers(projectId));
    }

    @GetMapping("/{userId}/check")
    public ResponseEntity<Boolean> checkMembership(
            @PathVariable Long projectId,
            @PathVariable String userId) {
        return ResponseEntity.ok(projectService.isUserInProject(projectId, userId));
    }
}