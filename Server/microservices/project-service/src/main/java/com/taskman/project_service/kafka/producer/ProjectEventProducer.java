package com.taskman.project_service.kafka.producer;

import com.taskman.project_service.entity.enums.ProjectStatus;
import com.taskman.project_service.kafka.event.ProjectEvent;
import com.taskman.project_service.entity.Project;
import com.taskman.project_service.entity.ProjectMembership;
import com.taskman.project_service.entity.enums.MemberRole;
import com.taskman.project_service.dao.interfaces.ProjectDao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProjectEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ProjectDao projectDao;

    @Value("${spring.kafka.topic.project-events}")
    private String topicName;

    public void sendProjectStatusUpdateEvent(Project project) {
        List<String> adminIds = project.getMemberships().stream()
                .filter(m -> m.getRole() == MemberRole.ADMIN)
                .map(ProjectMembership::getUserId)
                .collect(Collectors.toList());

        ProjectEvent event = ProjectEvent.builder()
                .eventType("PROJECT_UPDATED")
                .projectId(project.getId().toString())
                .projectName(project.getName())
                .description(project.getDescription())
                .status(project.getStatus().toString())
                .adminIds(adminIds)
                .endDate(project.getEndDate())
                .build();

        sendProjectEvent(event);
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional(readOnly = true)
    public void checkProjectDeadlines() {
        log.info("Checking project deadlines...");
        try {
            List<Project> projects = projectDao.findAll();
            LocalDate today = LocalDate.now();

            for (Project project : projects) {
                if (project.getEndDate() == null || ProjectStatus.COMPLETED.equals(project.getStatus())) {
                    continue;
                }

                LocalDate endDate = ((java.sql.Date) project.getEndDate()).toLocalDate();

                long daysUntilDeadline = ChronoUnit.DAYS.between(today, endDate);

                if (daysUntilDeadline < 0) {
                    log.info("Project {} is overdue. Due date was: {}",
                            project.getName(), project.getEndDate());
                    sendProjectOverdueEvent(project);
                } else if (daysUntilDeadline <= 3) {
                    log.info("Project {} deadline is approaching. Due date: {}",
                            project.getName(), project.getEndDate());
                    sendProjectDeadlineApproachingEvent(project);
                }
            }
            log.info("Project deadline check completed successfully");
        } catch (Exception e) {
            log.error("Error checking project deadlines: ", e);
        }
    }

    private void sendProjectOverdueEvent(Project project) {
        try {
            List<String> adminIds = project.getMemberships().stream()
                    .filter(m -> m.getRole() == MemberRole.ADMIN)
                    .map(ProjectMembership::getUserId)
                    .collect(Collectors.toList());

            ProjectEvent event = ProjectEvent.builder()
                    .eventType("PROJECT_OVERDUE")
                    .projectId(project.getId().toString())
                    .projectName(project.getName())
                    .status(project.getStatus().toString())
                    .adminIds(adminIds)
                    .endDate(project.getEndDate())
                    .build();

            log.info("Sending overdue notification for project: {}", project.getName());
            sendProjectEvent(event);
        } catch (Exception e) {
            log.error("Error sending overdue event for project {}: ", project.getName(), e);
        }
    }

    private void sendProjectDeadlineApproachingEvent(Project project) {
        try {
            List<String> adminIds = project.getMemberships().stream()
                    .filter(m -> m.getRole() == MemberRole.ADMIN)
                    .map(ProjectMembership::getUserId)
                    .collect(Collectors.toList());

            ProjectEvent event = ProjectEvent.builder()
                    .eventType("PROJECT_DEADLINE_APPROACHING")
                    .projectId(project.getId().toString())
                    .projectName(project.getName())
                    .status(project.getStatus().toString())
                    .adminIds(adminIds)
                    .endDate(project.getEndDate())
                    .build();

            log.info("Sending deadline approaching notification for project: {}", project.getName());
            sendProjectEvent(event);
        } catch (Exception e) {
            log.error("Error sending deadline approaching event for project {}: ", project.getName(), e);
        }
    }

    public void sendProjectEvent(ProjectEvent event) {
        log.info("Project event => {}", event.toString());
        kafkaTemplate.send(topicName, event);
    }

    public void sendMemberAssignedEvent(Project project, String newMemberId) {
        List<String> adminIds = project.getMemberships().stream()
                .filter(m -> m.getRole() == MemberRole.ADMIN)
                .map(ProjectMembership::getUserId)
                .collect(Collectors.toList());

        ProjectEvent event = ProjectEvent.builder()
                .eventType("PROJECT_MEMBER_ASSIGNED")
                .projectId(project.getId().toString())
                .projectName(project.getName())
                .userId(newMemberId)
                .adminIds(adminIds)
                .build();

        sendProjectEvent(event);
    }

    public void sendProjectCompletedEvent(Project project) {
        List<String> allMemberIds = project.getMemberships().stream()
                .map(ProjectMembership::getUserId)
                .collect(Collectors.toList());

        ProjectEvent event = ProjectEvent.builder()
                .eventType("PROJECT_COMPLETED")
                .projectId(project.getId().toString())
                .projectName(project.getName())
                .status(project.getStatus().toString())
                .adminIds(project.getMemberships().stream()
                        .filter(m -> m.getRole() == MemberRole.ADMIN)
                        .map(ProjectMembership::getUserId)
                        .collect(Collectors.toList()))
                .memberIds(allMemberIds)
                .build();

        sendProjectEvent(event);
    }

    public void sendProjectUpdateEvent(Project project, String updateType) {
        List<String> recipientIds;

        if (updateType.equals("ADMINISTRATIVE")) {
            recipientIds = project.getMemberships().stream()
                    .filter(m -> m.getRole() == MemberRole.ADMIN)
                    .map(ProjectMembership::getUserId)
                    .collect(Collectors.toList());
        } else {
            recipientIds = project.getMemberships().stream()
                    .map(ProjectMembership::getUserId)
                    .collect(Collectors.toList());
        }

        ProjectEvent event = ProjectEvent.builder()
                .eventType("PROJECT_UPDATED")
                .projectId(project.getId().toString())
                .projectName(project.getName())
                .description(project.getDescription())
                .status(project.getStatus().toString())
                .adminIds(project.getMemberships().stream()
                        .filter(m -> m.getRole() == MemberRole.ADMIN)
                        .map(ProjectMembership::getUserId)
                        .collect(Collectors.toList()))
                .memberIds(recipientIds)
                .endDate(project.getEndDate())
                .updateType(updateType)
                .build();

        sendProjectEvent(event);
    }
}