package com.taskman.task_service.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskAssignmentDTO {
    private Long id;
    private String userId;
    private Date assignedAt;
    private Date unassignedAt;
    private String assignedBy;
}
