package com.taskman.project_service.entity;

import com.taskman.project_service.entity.enums.MemberRole;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "project_memberships")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ProjectMembership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberRole role;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date joinedAt;
}