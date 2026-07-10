# AGENTS.md – Elemental Card Battle (Backend)

## Project Overview
Turn-based card game backend built with Spring Boot.  
Players collect elemental cards, join rooms, and battle against each other or bots in real-time via WebSocket.

## Tech Stack
- Java 17+
- Spring Boot 3 (Web, WebSocket, Security, Data JPA)
- PostgreSQL
- JWT Authentication (io.jsonwebtoken)
- Lombok, MapStruct
- STOMP over WebSocket (SockJS)

## Package Structure
com.elemental_card_battle.elemental_card_battle
├── auth/              # Registration, login, JWT handling
├── card/              # Card definitions, owned cards, card service
├── chatmessage/       # In-room chat via WebSocket
├── config/            # WebSocket, security, Jackson config
├── dto/               # Shared DTOs (game session, room)
├── exception/         # Custom exceptions by domain
├── gamesession/       # Game lifecycle, round resolution, timer
├── manager/           # Lobby (room management), GameSessionManager
├── mapper/            # Entity ↔ DTO mappers
├── model/             # Domain models (Room, GameSession, PlayerState)
├── roundicon/         # Round won icon service
├── room/              # Room REST controller + service
├── security/          # JWT filter, STOMP auth interceptor
├── session/           # ActiveSession, ActiveSessionManager
├── store/             # Card store (purchase)
├── user/              # User entity, service, profile
└── util/              # TurnTimer, GameSessionBroadcaster

## Key Conventions
- **Package by feature** – each domain has its own package.
- **DTOs use records** (`CardInStoreDto`, `RoundResultDto`, `ProfileDto`).
- **Services are transactional** where needed (`@Transactional`).
- **Bots** have negative `userId` (e.g. -1, -2). Humans have positive IDs.
- **Game communication** – REST for starting a game, WebSocket for in-game actions.
- **WebSocket destinations** – `/app` prefix for client → server, `/topic` for server → client.
- **Controllers** – `@AuthenticationPrincipal UserDetails` to get current user email.
- **Error handling** – custom exceptions mapped via `@RestControllerAdvice`.

## How to Run
1. Start PostgreSQL (default port 5432, database `ecb`).
2. Set environment variables: `JWT_SECRET`, `ISSUER`, `SPRING_DATASOURCE_*`.
3. Run `ElementalCardBattleApplication.java`.
4. WebSocket connects on `/ws` with SockJS.

## Common Tasks
- **Add new card** – insert into `card` table, set `price=0` for free cards.
- **Add bot name** – add to `BOT_NAMES` list in `RoomService`.
- **Debug game flow** – check logs in `GameSessionService`, `TurnTimer`, `GameSessionBroadcaster`.
- **Test WebSocket** – use Postman/websocat to connect and subscribe to `/topic/game/{id}/state`.