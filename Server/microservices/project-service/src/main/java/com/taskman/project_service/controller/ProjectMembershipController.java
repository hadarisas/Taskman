package com.taskman.project_service.controller;

import com.taskman.project_service.dto.ProjectMembershipDTO;
import com.taskman.project_service.entity.enums.MemberRole;
import com.taskman.project_service.security.JwtService;
import com.taskman.project_service.service.interfaces.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/members")
public class ProjectMembershipController {

    private final ProjectService projectService;
    private final JwtService jwtService;

    public ProjectMembershipController(ProjectService projectService, JwtService jwtService) {
        this.projectService = projectService;
        this.jwtService = jwtService;
    }
    @PutMapping("/{targetUserId}/role")
    public ResponseEntity<ProjectMembershipDTO> updateMemberRole(
            @PathVariable Long projectId,
            @PathVariable String targetUserId,
            @RequestParam MemberRole role,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(projectService.updateMemberRole(projectId, targetUserId, role));
    }

    @GetMapping("/{targetUserId}/check")
    public ResponseEntity<Boolean> checkMembership(
            @PathVariable Long projectId,
            @PathVariable String targetUserId,
            @RequestHeader("Authorization") String token) {
        String userId = jwtService.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(projectService.isUserInProject(projectId, targetUserId));
    }
}