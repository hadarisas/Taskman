package com.taskman.user_service.config;

import com.taskman.user_service.entity.User;
import com.taskman.user_service.entity.enums.UserRole;
import com.taskman.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("hadarisas@gmail.com").isEmpty()) {
            User admin = User.builder()
                    .name("Hadarisas")
                    .email("hadarisas@gmail.com")
                    .password(passwordEncoder.encode("taskman123"))
                    .role(UserRole.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user created successfully!");
        }
    }
} 