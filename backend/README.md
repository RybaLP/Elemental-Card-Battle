# Elemental Card Battle - Backend

## Overview
Backend service for the Elemental Card Battle game, built with Spring Boot. It manages real-time game state, user sessions, and turn-based logic via WebSockets.

## Architecture
- **Game Engine**: Handles turn-based mechanics and validation.
- **WebSocket Gateway**: Manages STOMP connections and state synchronization.
- **Persistence**: Spring Data JPA with SQLite (easily portable to PostgreSQL).

## Key Features
- Real-time lobby management with automatic bot-lobby cleanup.
- REST API for user authentication and game metadata.
- Automated CI/CD pipeline using GitHub Actions.

## Maintenance
- **Bot Cleanup**: See `LobbyCleanupService.java` for logic regarding automated lobby pruning.
- **Thread Safety**: State is managed in a `ConcurrentHashMap` within the `GameManager` class.

## Deployment
Packaged as a Docker container.
- Build: `docker compose build`
- Run: `docker compose up -d`