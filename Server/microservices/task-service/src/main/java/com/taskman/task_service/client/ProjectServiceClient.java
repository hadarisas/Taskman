package com.taskman.task_service.client;


import com.taskman.task_service.dto.ProjectMembershipDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "${project-service.name}")
public interface ProjectServiceClient {

    @GetMapping("/api/projects/{projectId}/members")
    ResponseEntity<List<ProjectMembershipDto>> getProjectMembers(
            @PathVariable("projectId") String projectId,
            @RequestHeader("Authorization") String token
    );

    @GetMapping("/api/projects/{projectId}/admins")
    List<String> getProjectAdmins(
            @PathVariable("projectId") String projectId,
            @RequestHeader("Authorization") String token
    );
}