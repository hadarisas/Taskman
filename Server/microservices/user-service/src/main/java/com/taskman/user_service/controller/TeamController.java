package com.taskman.user_service.controller;

import com.taskman.user_service.dto.TeamDTO;
import com.taskman.user_service.dto.TeamMembershipDTO;
import com.taskman.user_service.dto.UserDTO;
import com.taskman.user_service.dto.request.AddTeamMemberRequest;
import com.taskman.user_service.dto.request.CreateTeamRequest;
import com.taskman.user_service.dto.request.UpdateTeamRequest;
import com.taskman.user_service.dto.request.UpdateTeamMemberRoleRequest;
import com.taskman.user_service.service.interfaces.TeamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;
    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    // Create team
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TeamDTO createTeam(@Valid @RequestBody CreateTeamRequest request) {
        return teamService.createTeam(request);
    }

    // Get team by id
    @GetMapping("/{id}")
    public TeamDTO getTeamById(@PathVariable Long id) {
        return teamService.getTeamById(id);
    }

    // Get all teams
    @GetMapping
    public List<TeamDTO> getAllTeams() {
        return teamService.getAllTeams();
    }

    // Get teams by user id
    @GetMapping("/user/{userId}")
    public List<TeamDTO> getTeamsByUserId(@PathVariable Long userId) {
        return teamService.getTeamsByUserId(userId);
    }

    // Get team members
    @GetMapping("/{id}/members")
    public List<TeamMembershipDTO> getTeamMembers(@PathVariable Long id) {
        return teamService.getTeamMembers(id);
    }

    // Update team
    @PutMapping("/{id}")
    public TeamDTO updateTeam(@PathVariable Long id,@Valid @RequestBody UpdateTeamRequest request) {
        return teamService.updateTeam(id, request);
    }

    // Delete team
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
    }

    // Remove member from team
    @DeleteMapping("/{teamId}/members/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMemberFromTeam(@PathVariable Long teamId, @PathVariable Long userId) {
        teamService.removeMemberFromTeam(teamId, userId);
    }

    // Update member role in team
    @PutMapping("/{teamId}/members/{userId}/role")
    public TeamMembershipDTO updateMemberRole(
            @PathVariable Long teamId,
            @PathVariable Long userId,
            @Valid @RequestBody UpdateTeamMemberRoleRequest request) {
        return teamService.updateMemberRole(teamId, userId, request.getRole());
    }

    // Validation
    @GetMapping("/exists/name/{name}")
    public boolean existsByName(@PathVariable String name) {
        return teamService.existsByName(name);
    }

    // Add member to team   
    @PostMapping("/{teamId}/members")
    public ResponseEntity<TeamMembershipDTO> addMember(
            @PathVariable Long teamId,
            @Valid @RequestBody AddTeamMemberRequest request) {
        TeamMembershipDTO membership = teamService.addMemberToTeam(
            teamId, 
            request.getUserId(), 
            request.getRole()
        );
        return ResponseEntity.ok(membership);
    }

    // Get team leaders 
    @GetMapping("/{teamId}/leaders")
    public ResponseEntity<List<UserDTO>> getTeamLeaders(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamService.getTeamLeaders(teamId));
    }
}