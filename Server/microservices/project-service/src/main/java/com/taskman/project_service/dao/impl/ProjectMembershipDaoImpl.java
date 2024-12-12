package com.taskman.project_service.dao.impl;

import com.taskman.project_service.dao.interfaces.ProjectMembershipDao;
import com.taskman.project_service.entity.ProjectMembership;
import com.taskman.project_service.entity.enums.MemberRole;
import com.taskman.project_service.repository.ProjectMembershipRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ProjectMembershipDaoImpl extends BaseDaoImpl<ProjectMembership, Long> implements ProjectMembershipDao {

    private final ProjectMembershipRepository membershipRepository;

    public ProjectMembershipDaoImpl(ProjectMembershipRepository membershipRepository) {
        super(ProjectMembership.class);
        this.membershipRepository = membershipRepository;
    }

    @Override
    public List<ProjectMembership> findByProjectId(Long projectId) {
        return membershipRepository.findByProjectId(projectId);
    }

    @Override
    public List<ProjectMembership> findByUserId(String userId) {
        return membershipRepository.findByUserId(userId);
    }

    @Override
    public Optional<ProjectMembership> findByProjectIdAndUserId(Long projectId, String userId) {
        return membershipRepository.findByProjectIdAndUserId(projectId, userId);
    }

    @Override
    public List<ProjectMembership> findByProjectIdAndRole(Long projectId, MemberRole role) {
        return membershipRepository.findByProjectIdAndRole(projectId, role);
    }

    @Override
    public boolean existsByProjectIdAndUserId(Long projectId, String userId) {
        return membershipRepository.existsByProjectIdAndUserId(projectId, userId);
    }

    @Override
    public void deleteByProjectIdAndUserId(Long projectId, String userId) {
        membershipRepository.deleteByProjectIdAndUserId(projectId, userId);
    }

    @Override
    public long countByProjectId(Long projectId) {
        return membershipRepository.countByProjectId(projectId);
    }

    @Override
    public long countByUserId(String userId) {
        return membershipRepository.countByUserId(userId);
    }
}