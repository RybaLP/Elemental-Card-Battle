package com.elemental_card_battle.elemental_card_battle.gamesession;

import com.elemental_card_battle.elemental_card_battle.exception.room.NotRoomOwnerException;
import com.elemental_card_battle.elemental_card_battle.exception.room.RoomNotFoundException;
import com.elemental_card_battle.elemental_card_battle.manager.Lobby;
import com.elemental_card_battle.elemental_card_battle.model.*;
import com.elemental_card_battle.elemental_card_battle.card.CardService;
import com.elemental_card_battle.elemental_card_battle.room.RoomService;
import com.elemental_card_battle.elemental_card_battle.session.ActiveSession;
import com.elemental_card_battle.elemental_card_battle.session.ActiveSessionManager;
import com.elemental_card_battle.elemental_card_battle.session.SessionStatus;
import com.elemental_card_battle.elemental_card_battle.util.GameSessionBroadcaster;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
@Slf4j
public class GameSessionManager {

    private final GameSessionBroadcaster gameSessionBroadcaster;
    private final Lobby lobby;
    private final ActiveSessionManager activeSessionManager;
    private final Map<String, GameSession> sessions = new ConcurrentHashMap<>();
    private final RoomService roomService;
    private final CardService cardService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public GameSession startGame(String roomId, String email) {
        Room room = lobby.getRoom(roomId);
        ActiveSession host = activeSessionManager.getSessionByEmail(email);

        if (!room.getRoomOwner().getUserId().equals(host.getUserId())) {
            throw new NotRoomOwnerException();
        }

        if (room.getPlayers().size() != 2) {
            throw new IllegalStateException("Room must have exactly 2 players to start!");
        }

        if (room.isGameStarted()) {
            throw new IllegalStateException("Game already started in this room!");
        }

        ActiveSession p1 = room.getPlayers().get(0);
        ActiveSession p2 = room.getPlayers().get(1);

        GameSession gameSession = createSession(roomId);

        room.getPlayers().forEach(p -> {
            p.setStatus(SessionStatus.IN_GAME);
            p.setCurrentGameSessionId(gameSession.getId());
            p.setCurrentRoomId(null);
        });

        room.setGameStarted(true);

        simpMessagingTemplate.convertAndSend(
                "/topic/room/" + roomId + "/game-started",
                Map.of(
                        "sessionId", gameSession.getId(),
                        "message", "Game has started!",
                        "player1", p1.getNickname(),
                        "player2", p2.getNickname()
                )
        );
        gameSessionBroadcaster.broadcastGameStart(gameSession);
        return gameSession;
    }

    public GameSession createSession(String roomId) {
        Room room = lobby.getRoom(roomId);
        if (room == null || room.getPlayers().size() != 2) {
            throw new RoomNotFoundException("Room not found or incomplete players");
        }

        ActiveSession p1 = room.getPlayers().get(0);
        ActiveSession p2 = room.getPlayers().get(1);

        String sessionId = UUID.randomUUID().toString();

        GameSession gameSession = GameSession.builder()
                .id(sessionId)
                .roomId(roomId)
                .player1(PlayerState.builder()
                        .userId(p1.getUserId())
                        .nickname(p1.getNickname())
                        .build())
                .player2(PlayerState.builder()
                        .userId(p2.getUserId())
                        .nickname(p2.getNickname())
                        .build())
                .timerActive(false)
                .turnNumber(0)
                .isOver(false)
                .build();

        gameSession.getPlayer1().setCurrentHand(cardService.generateInitialHand(p1.getUserId()));
        gameSession.getPlayer2().setCurrentHand(cardService.generateInitialHand(p2.getUserId()));

        sessions.put(sessionId, gameSession);

        gameSessionBroadcaster.broadcastInitialState(gameSession);
        gameSessionBroadcaster.broadcastGameStart(gameSession);

        log.info("Game session {} created for room {}", sessionId, roomId);

        return gameSession;
    }

    public GameSession getSessionById(String sessionId) {
        return sessions.get(sessionId);
    }

    public GameSession findSessionByUserId(Long userId) {
        if (userId == null) return null;

        return sessions.values().stream()
                .filter(session ->
                        session.getPlayer1().getUserId().equals(userId) ||
                                session.getPlayer2().getUserId().equals(userId))
                .findFirst()
                .orElse(null);
    }

    public void killSession(String sessionId) {
        sessions.remove(sessionId);
        log.info("Game session {} terminated", sessionId);
    }
}