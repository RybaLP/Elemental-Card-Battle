# Elemental Card Battle - Frontend

## Overview
Frontend application for the Elemental Card Battle game, built with **Next.js** and **TypeScript**. It provides a reactive UI for real-time card gameplay, synchronizing state with the backend via REST and WebSockets.

## Architecture Decisions
*   **Next.js (App Router)**: Selected for native support of React Server Components and optimized routing capabilities.
*   **TypeScript**: Enforced strictly to ensure type safety across complex game objects (e.g., `GameState`, `Card`, `PlayerAction`).
*   **State Strategy**: Global state management to minimize unnecessary re-renders during high-frequency WebSocket updates.

## Live Environment
*   **Production Instance**: [https://ecbgame.bieda.it](https://ecbgame.bieda.it)

## Data Flow
*   **REST API**: Used for static metadata, user authentication, and non-real-time resource fetching.
*   **WebSockets (STOMP)**: Primary channel for real-time game state synchronization. Key events managed: `GAME_STARTED`, `CARD_PLAYED`, `TURN_CHANGED`.

## Development
1.  **Installation**: `npm install`
2.  **Configuration**: Create `.env.local` based on `.env.local.example` and set `NEXT_PUBLIC_API_URL` to your backend endpoint.
3.  **Local Development**: `npm run dev`
4.  **Quality Assurance**: Run `npm run lint` to ensure code standard compliance before committing.

## Key Engineering Challenges
*   **State Consistency**: Maintaining synchronization between the client UI and the server game engine during network latency or reconnection events.