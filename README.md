# Elemental Card Battle

<div align="center">
  <img src="docs/screenshots/game-logo.png" alt="Game Logo" width="300"/>
  
  ### Multiplayer elemental card game inspired by Card Jitsu
  
  [![Live Demo](https://img.shields.io/badge/🎮_Play_Now-Live_Demo-success?style=for-the-badge)](https://ecbgame.bieda.it)
</div>

## Overview
**Elemental Card Battle** is a real-time multiplayer card game for two players. Inspired by the mechanics of *Card Jitsu*, this project reimagines turn-based card combat in a fantasy setting. The system handles real-time game state, user sessions, and turn-based logic via WebSockets.

<div align="center">
  <img src="docs/screenshots/elemental-gameplay.PNG" alt="Gameplay" width="700"/>
</div>

---

## Technical Architecture
*   **Backend**: Java Spring Boot, utilizing STOMP and SockJS for WebSocket-based state management.
*   **Frontend**: Next.js 13 (App Router) with TypeScript.
*   **Communication**: REST API for metadata and authentication, WebSockets for real-time game state synchronization.
*   **Persistence**: PostgreSQL.

## Deployment
The application is hosted on a production-grade VPS (Mikrus.pl).
*   **Live Instance**: [https://ecbgame.bieda.it](https://ecbgame.bieda.it)
*   **Backend Endpoint**: [https://apiecb.bieda.it](https://apiecb.bieda.it)
*   **API Documentation**: [https://apiecb.bieda.it/swagger-ui.html](https://apiecb.bieda.it/swagger-ui.html)

---

## UI / Graphics
All card illustrations were generated using **Google Gemini** with consistent prompts to maintain a unified visual style.

<div align="center">
  <img src="docs/screenshots/figma-assets.PNG" alt="Figma Assets" width="700"/>
</div>

---

## Engineering Features
*   **Real-time Synchronization**: Full WebSocket implementation for lobby management and game flow.
*   **Automated Maintenance**: Implemented server-side logic (`LobbyCleanupService`) to prune inactive or bot-populated sessions.
*   **CI/CD**: Automated build and linting workflows via GitHub Actions.

## Development Setup
Each component contains its own `README.md` with instructions specific to its tech stack. For local environment setup, ensure you have Java 17+, Node.js 18+, and Docker installed to match the production container configuration.