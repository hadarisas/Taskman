package com.taskman.user_service.repository;

import com.taskman.user_service.entity.TeamMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeamMembershipRepository extends JpaRepository<TeamMembership, Long> {
    List<TeamMembership> findByTeamId(Long teamId);
    List<TeamMembership> findByUserId(Long userId);
}