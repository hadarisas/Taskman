# Taskman

## Project Management App

**Taskman** is a project management application designed to streamline task and project management for teams. The app offers features such as project creation, task assignment, team collaboration, and progress tracking. With **Taskman**, users can easily manage their projects, assign tasks to team members, track milestones, and communicate more effectively to meet deadlines. The application aims to provide an intuitive and robust platform for managing multiple projects at once while improving team efficiency and transparency.

### Features

- **Project Management**: Create, update, and delete projects.
- **Task Management**: Create tasks, assign them to team members, set due dates, and track progress.
- **User Management**: Add or remove users to/from projects, assign roles, and monitor their progress.
- **Notifications**: Alerts and reminders for due dates, status changes, and important events.
- **Real-time Updates**: Instant updates and notifications to keep everyone on the same page.

### Technology Stack

- **Backend**: Spring Boot, Spring Cloud, Kafka
- **Frontend**: React (planned, but not implemented yet)
- **Database**: PostgreSQL
- **Message Broker**: Kafka (for notifications and events)
- **Authentication**: JWT-based authentication
- **API Documentation**: Swagger (for testing and exploring APIs)

### Project Status

This project is still under active development. Some features are implemented, but others are yet to be completed. You can check the progress in the **To-Do** section below.

### To-Do

- **Finish the Notification Service**: The notification system needs further development to handle different types of notifications (e.g., email, SMS, in-app).
- **Finish Kafka Notification**: Set up Kafka-based notifications for asynchronous message delivery across services.
- **Add Kafka Producer/Consumer Events to All Microservices**: Implement Kafka event producers and consumers in all microservices for better inter-service communication and event-driven architecture.
- **Build the Frontend using React or Vuejs (still didn't decide yet )**
