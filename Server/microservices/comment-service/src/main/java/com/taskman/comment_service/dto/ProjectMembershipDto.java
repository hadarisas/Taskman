package com.taskman.comment_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMembershipDto {
    private Long id;
    private String userId;
    private String role;
    private Date joinedAt;
}