package com.taskman.project_service.dao.interfaces;

import com.taskman.project_service.entity.ProjectMembership;
import com.taskman.project_service.entity.enums.MemberRole;

import java.util.List;
import java.util.Optional;

public interface ProjectMembershipDao extends BaseDao<ProjectMembership, Long> {
    List<ProjectMembership> findByProjectId(Long projectId);
    List<ProjectMembership> findByUserId(String userId);
    Optional<ProjectMembership> findByProjectIdAndUserId(Long projectId, String userId);
    List<ProjectMembership> findByProjectIdAndRole(Long projectId, MemberRole role);
    boolean existsByProjectIdAndUserId(Long projectId, String userId);
    void deleteByProjectIdAndUserId(Long projectId, String userId);
    long countByProjectId(Long projectId);
    long countByUserId(String userId);
}