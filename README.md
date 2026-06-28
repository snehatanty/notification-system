# 🔔 Distributed Notification System

A production-ready distributed notification system built with Spring Boot, RabbitMQ, Redis, and SendGrid.

## Tech Stack

- **Backend:** Java 17, Spring Boot 3
- **Message Queue:** RabbitMQ
- **Cache/Rate Limiting:** Redis
- **Database:** MySQL + Flyway
- **Email Delivery:** SendGrid
- **Frontend:** React.js
- **Infrastructure:** Docker Compose

## Features

- Async notification delivery via RabbitMQ
- Multi-channel support (EMAIL, IN_APP)
- Redis rate limiting (10 notifications/hour per user)
- Retry with exponential backoff
- Dead Letter Queue for failed messages
- Real-time React dashboard with live polling
- REST API with Spring Boot Actuator

## Quick Start

1. Clone the repo
2. Copy `src/main/resources/application.yml.example` to `application.yml`
3. Add your SendGrid API key to `application.yml`
4. Start infrastructure: `docker compose up -d`
5. Start backend: `mvn spring-boot:run`
6. Start frontend: `cd frontend && npm install && npm start`
7. Open `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/notifications | Send a notification |
| GET | /api/notifications/{userId} | Get user notifications |
| POST | /api/users | Create a user |

## Architecture

Client → REST API → RabbitMQ Queue → Consumer → SendGrid

↓                ↓

Redis            MySQL DB

(Rate Limit)     (Status Track)

↓

Dead Letter Queue

## Author

**Sneha Tanty** — Java Backend Developer  
GitHub: https://github.com/snehatanty  
LinkedIn: https://linkedin.com/in/snehatanty