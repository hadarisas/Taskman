package com.taskman.user_service.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddTeamMembersRequest {
    @NotEmpty(message = "Members list cannot be empty")
    private List<@Valid AddTeamMemberRequest> members;
} 