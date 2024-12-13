package com.taskman.comment_service.dto.response;

import com.taskman.comment_service.dto.CommentDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private List<CommentDTO> comments;
    private long totalComments;
    private int pageNumber;
    private int pageSize;
    private boolean hasNext;
} 