# Elemental Card Battle

Multiplayer card game based on the core mechanics of Card Jitsu, featuring real-time WebSocket communication and a custom elemental-themed card system.

## Project Overview
The project is a real-time multiplayer application designed for two-player sessions. It implements a turn-based card system where game logic, state synchronization, and user interaction are handled via a robust backend-frontend integration.

## Technical Architecture
*   **Backend**: Java Spring Boot, utilizing STOMP and SockJS for WebSocket-based state management.
*   **Frontend**: Next.js with TypeScript.
*   **Communication**: REST API for metadata and authentication, WebSockets for real-time game state synchronization.
*   **Persistence**: PostgreSQL.

## Deployment
The application is hosted on a production-grade VPS (Mikrus.pl).
*   **Live Instance**: [https://ecbgame.bieda.it](https://ecbgame.bieda.it)
*   **Backend Endpoint**: [https://apiecb.bieda.it](https://apiecb.bieda.it)
*   **API Documentation**: [https://apiecb.bieda.it/swagger-ui.html](https://apiecb.bieda.it/swagger-ui.html)

## Repository Structure
*   `/frontend`: Next.js client application.
*   `/backend`: Spring Boot server application.
*   `/docs`: Project documentation and architecture diagrams.

## Engineering Features
*   **Real-time Synchronization**: Full WebSocket implementation for lobby management and game flow.
*   **Automated Maintenance**: Implemented server-side logic (`LobbyCleanupService`) to prune inactive or bot-populated sessions.
*   **CI/CD**: Automated build and linting workflows via GitHub Actions.

## Development Setup
Each component contains its own `README.md` with instructions specific to its tech stack. For local environment setup, ensure you have Java 17+, Node.js 18+, and Docker installed.