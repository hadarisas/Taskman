package com.taskman.notification_service.config;

import com.taskman.notification_service.dto.CommentEventDto;
import com.taskman.notification_service.dto.ProjectEventDto;
import com.taskman.notification_service.dto.TaskEventDto;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id}")
    private String groupId;

    private Map<String, Object> getCommonConsumerConfig() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        return props;
    }





    @Bean
    public ConsumerFactory<String, CommentEventDto> commentEventConsumerFactory() {
        return new DefaultKafkaConsumerFactory<>(
                getCommonConsumerConfig(),
                new StringDeserializer(),
                new JsonDeserializer<>(CommentEventDto.class, false)
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, CommentEventDto> commentKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, CommentEventDto> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(commentEventConsumerFactory());
        return factory;
    }

    @Bean
    public ConsumerFactory<String, TaskEventDto> taskEventConsumerFactory() {
        return new DefaultKafkaConsumerFactory<>(
                getCommonConsumerConfig(),
                new StringDeserializer(),
                new JsonDeserializer<>(TaskEventDto.class, false)
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, TaskEventDto> taskKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, TaskEventDto> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(taskEventConsumerFactory());
        return factory;
    }

    @Bean
    public ConsumerFactory<String, ProjectEventDto> projectEventConsumerFactory() {
        return new DefaultKafkaConsumerFactory<>(
                getCommonConsumerConfig(),
                new StringDeserializer(),
                new JsonDeserializer<>(ProjectEventDto.class, false)
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, ProjectEventDto> projectKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, ProjectEventDto> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(projectEventConsumerFactory());
        return factory;
    }

    @Bean
    public ConsumerFactory<String, String> stringConsumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        return new DefaultKafkaConsumerFactory<>(props);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> stringKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(stringConsumerFactory());
        return factory;
    }
}