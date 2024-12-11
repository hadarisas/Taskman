package com.taskman.user_service.service.impl;

import com.taskman.user_service.dao.interfaces.TeamDao;
import com.taskman.user_service.dao.interfaces.UserDao;
import com.taskman.user_service.dto.TeamDTO;
import com.taskman.user_service.dto.TeamMembershipDTO;
import com.taskman.user_service.dto.UserDTO;
import com.taskman.user_service.dto.request.CreateTeamRequest;
import com.taskman.user_service.dto.request.UpdateTeamRequest;
import com.taskman.user_service.entity.Team;
import com.taskman.user_service.entity.TeamMembership;
import com.taskman.user_service.entity.User;
import com.taskman.user_service.entity.enums.TeamRole;
import com.taskman.user_service.exception.TeamNameAlreadyExistsException;
import com.taskman.user_service.exception.TeamNotFoundException;
import com.taskman.user_service.exception.UserNotFoundException;
import com.taskman.user_service.repository.TeamMembershipRepository;
import com.taskman.user_service.repository.TeamRepository;
import com.taskman.user_service.service.interfaces.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TeamServiceImpl implements TeamService {

    private final TeamDao teamDao;
    private final UserDao userDao;
    private final TeamMembershipRepository membershipRepository;
    private final TeamRepository teamRepository;

    @Override
    public TeamDTO createTeam(CreateTeamRequest request) {
        if (existsByName(request.getName())) {
            throw new TeamNameAlreadyExistsException("Team name already exists: " + request.getName());
        }

        Team team = Team.builder()
                .name(request.getName())
                .build();

        Team savedTeam = teamDao.save(team);
        return convertToDTO(savedTeam);
    }

    @Override
    public TeamDTO getTeamById(Long id) {
        Team team = teamDao.findById(id)
                .orElseThrow(() -> new TeamNotFoundException("Team not found with id: " + id));
        return convertToDTO(team);
    }

    @Override
    public List<TeamDTO> getAllTeams() {
        return teamDao.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamDTO> getTeamsByUserId(Long userId) {
        return membershipRepository.findByUserId(userId).stream()
                .map(membership -> convertToDTO(membership.getTeam()))
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamMembershipDTO> getTeamMembers(Long teamId) {
        return membershipRepository.findByTeamId(teamId).stream()
                .map(this::convertMembershipToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TeamDTO updateTeam(Long id, UpdateTeamRequest request) {
        Team team = teamDao.findById(id)
                .orElseThrow(() -> new TeamNotFoundException("Team not found with id: " + id));

        if (!team.getName().equals(request.getName()) && existsByName(request.getName())) {
            throw new TeamNameAlreadyExistsException("Team name already exists: " + request.getName());
        }

        team.setName(request.getName());
        Team updatedTeam = teamDao.save(team);
        return convertToDTO(updatedTeam);
    }

    @Override
    public void deleteTeam(Long id) {
        if (!teamDao.existsById(id)) {
            throw new TeamNotFoundException("Team not found with id: " + id);
        }
        teamDao.deleteById(id);
    }

    @Override
    public TeamMembershipDTO addMemberToTeam(Long teamId, Long userId, TeamRole role) {
        Team team = teamDao.findById(teamId)
                .orElseThrow(() -> new TeamNotFoundException("Team not found with id: " + teamId));

        User user = userDao.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));

        if (isUserInTeam(teamId, userId)) {
            throw new IllegalStateException("User is already a member of this team");
        }

        TeamMembership membership = TeamMembership.builder()
                .team(team)
                .user(user)
                .role(role)
                .joinedAt(LocalDateTime.now())
                .build();

        TeamMembership savedMembership = membershipRepository.save(membership);
        return convertMembershipToDTO(savedMembership);
    }

    @Override
    public void removeMemberFromTeam(Long teamId, Long userId) {
        membershipRepository.findByTeamId(teamId).stream()
                .filter(m -> m.getUser().getId().equals(userId))
                .findFirst()
                .ifPresent(membershipRepository::delete);
    }

    @Override
    public TeamMembershipDTO updateMemberRole(Long teamId, Long userId, TeamRole newRole) {
        TeamMembership membership = membershipRepository.findByTeamId(teamId).stream()
                .filter(m -> m.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("User is not a member of this team"));

        membership.setRole(newRole);
        TeamMembership updatedMembership = membershipRepository.save(membership);
        return convertMembershipToDTO(updatedMembership);
    }

    @Override
    public boolean isUserInTeam(Long teamId, Long userId) {
        return membershipRepository.findByTeamId(teamId).stream()
                .anyMatch(m -> m.getUser().getId().equals(userId));
    }

    @Override
    public boolean existsByName(String name) {
        return teamDao.existsByName(name);
    }

    @Override
    public List<UserDTO> getTeamLeaders(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new TeamNotFoundException("Team not found with id: " + teamId));

        return team.getMemberships().stream()
                .filter(membership -> membership.getRole() == TeamRole.ADMIN)
                .map(membership -> UserDTO.builder()
                        .id(membership.getUser().getId())
                        .name(membership.getUser().getName())
                        .email(membership.getUser().getEmail())
                        .role(membership.getUser().getRole())
                        .active(membership.getUser().isActive())
                        .build())
                .collect(Collectors.toList());
    }

    private TeamDTO convertToDTO(Team team) {
        List<TeamMembershipDTO> members = team.getMemberships() != null 
            ? team.getMemberships().stream()
                .map(this::convertToMembershipDTO)
                .collect(Collectors.toList())
            : new ArrayList<>();

        return TeamDTO.builder()
                .id(team.getId())
                .name(team.getName())
                .members(members)
                .build();
    }

    private TeamMembershipDTO convertMembershipToDTO(TeamMembership membership) {
        return TeamMembershipDTO.builder()
                .id(membership.getId())
                .userId(membership.getUser().getId())
                .userName(membership.getUser().getName())
                .role(membership.getRole())
                .build();
    }

    private TeamMembershipDTO convertToMembershipDTO(TeamMembership membership) {
        return TeamMembershipDTO.builder()
                .id(membership.getId())
                .userId(membership.getUser().getId())
                .userName(membership.getUser().getName())
                .role(membership.getRole())
                .build();
    }
}