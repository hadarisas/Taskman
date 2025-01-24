package com.taskman.comment_service.client;

import com.taskman.comment_service.dto.ProjectMembershipDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "${projectservice.name}")
public interface ProjectServiceClient {
    @GetMapping("/api/projects/{projectId}/members")
    ResponseEntity<List<ProjectMembershipDto>> getProjectMembers(
            @PathVariable("projectId") String projectId,
            @RequestHeader("Authorization") String token
    );
}