package com.taskman.project_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

@Configuration
public class KafkaConfig {

    @Value("${spring.kafka.topic.name}")
    private String taskTopicName;

    @Value("${spring.kafka.topic.project-events}")
    private String projectTopicName;

    // Create topics
    @Bean
    public NewTopic taskTopic() {
        return TopicBuilder.name(taskTopicName)
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic projectTopic() {
        return TopicBuilder.name(projectTopicName)
                .partitions(1)
                .replicas(1)
                .build();
    }

    // For producing project events
    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate(ProducerFactory<String, Object> producerFactory) {
        return new KafkaTemplate<>(producerFactory);
    }
} 