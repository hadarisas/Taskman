package com.taskman.project_service.kafka.producer;

import com.taskman.project_service.kafka.event.ProjectEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectEventProducer {
    
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${spring.kafka.topic.project-events}")
    private String topicName;

    public void sendProjectEvent(ProjectEvent event) {
        log.info("Project event => {}", event.toString());
        kafkaTemplate.send(topicName, event);
    }
} 