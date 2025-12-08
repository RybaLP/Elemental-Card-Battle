<img src="docs/screenshots/game-logo.png" alt="Game Logo" width="300"/>
Multiplayer elemental card game inspired by Club Penguin’s **Card Jitsu**.

---

## Overview

**Elemental Card Battle** is a multiplayer card game for two players. The project was inspired by the classic **Card Jitsu** from Club Penguin — a game I greatly enjoyed but which became unavailable after the servers were shut down.

This project is a simplified reinterpretation that preserves the core mechanics of Card Jitsu while adapting them to a fantasy setting. The game features elemental kings, ninjas, dragons, and other mythical creatures.

*Loosely inspired by [Card Jitsu](https://clubpenguin.fandom.com/wiki/Card-Jitsu) from Club Penguin.*

<img src="docs/screenshots/elemental-gameplay.PNG" alt="Gameplay" width="600"/>

---

## Technologies

### Frontend
- Next.js 13 (App Router)
- TypeScript
- Tailwind CSS
- Zustand
- Framer Motion
- Three.js

### Backend
- Spring Boot (Java)
- STOMP + SockJS (WebSockets)
- PostgreSQL

### Others
- **Figma** – UI/UX design
- **Google Gemini** – AI-generated card graphics (consistent prompts)
---

## UI / Graphics

All card illustrations were generated using **Google Gemini** with consistent prompts to maintain a unified visual style.

![Figma Assets](docs/screenshots/figma-assets.PNG)

---

## Current Features

- Create & join rooms
- Real-time chat in lobby
- Live notifications when players join or leave
- Smooth, WebSocket-powered gameplay
- Auto-cleaning of inactive rooms (ghost lobby prevention)
- Responsive UI for desktop & mobile

---

