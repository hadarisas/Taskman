package com.taskman.project_service.repository;

import com.taskman.project_service.entity.ProjectMembership;
import com.taskman.project_service.entity.enums.MemberRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMembershipRepository extends JpaRepository<ProjectMembership, Long> {
    // Find all memberships for a project
    List<ProjectMembership> findByProjectId(Long projectId);

    // Find all projects where a user is a member
    List<ProjectMembership> findByUserId(String userId);

    // Find specific membership for a user in a project
    Optional<ProjectMembership> findByProjectIdAndUserId(Long projectId, String userId);

    // Find memberships by role
    List<ProjectMembership> findByProjectIdAndRole(Long projectId, MemberRole role);

    // Check if user is a member of a project
    boolean existsByProjectIdAndUserId(Long projectId, String userId);

    // Delete membership for a user in a project
    void deleteByProjectIdAndUserId(Long projectId, String userId);

    // Count members in a project
    long countByProjectId(Long projectId);

    // Count projects for a user
    long countByUserId(String userId);
}