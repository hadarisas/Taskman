package com.taskman.user_service.service.interfaces;

import com.taskman.user_service.dto.TeamDTO;
import com.taskman.user_service.dto.TeamMembershipDTO;
import com.taskman.user_service.dto.UserDTO;
import com.taskman.user_service.dto.request.CreateTeamRequest;
import com.taskman.user_service.dto.request.UpdateTeamRequest;
import com.taskman.user_service.entity.enums.TeamRole;

import java.util.List;

public interface TeamService {
    // Create
    TeamDTO createTeam(CreateTeamRequest request);

    // Read
    TeamDTO getTeamById(Long id);
    List<TeamDTO> getAllTeams();
    List<TeamDTO> getTeamsByUserId(Long userId);
    List<TeamMembershipDTO> getTeamMembers(Long teamId);

    // Update
    TeamDTO updateTeam(Long id, UpdateTeamRequest request);

    // Delete
    void deleteTeam(Long id);

    // Membership management
    TeamMembershipDTO addMemberToTeam(Long teamId, Long userId, TeamRole role);
    void removeMemberFromTeam(Long teamId, Long userId);
    TeamMembershipDTO updateMemberRole(Long teamId, Long userId, TeamRole role);

    // Validation
    boolean isUserInTeam(Long teamId, Long userId);
    boolean existsByName(String name);

    // Team leaders
    List<UserDTO> getTeamLeaders(Long teamId);
}