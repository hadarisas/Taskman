package com.taskman.comment_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "${task-service.name}")
public interface TaskServiceClient {
    @GetMapping("/api/tasks/{taskId}/owner")
    ResponseEntity<String> getTaskOwner(
            @PathVariable("taskId") Long taskId,
            @RequestHeader("Authorization") String token
    );
}