package com.elemental_card_battle.elemental_card_battle.manager;

import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardInstance;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardPlayDto;
import com.elemental_card_battle.elemental_card_battle.model.*;
import com.elemental_card_battle.elemental_card_battle.card.CardService;
import com.elemental_card_battle.elemental_card_battle.session.ActiveSession;
import com.elemental_card_battle.elemental_card_battle.util.GameSessionBroadcaster;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class GameSessionManager {

    private final CardService cardService;
    private final GameSessionBroadcaster gameSessionBroadcaster;
    private final Lobby lobby;
    private final Map<String, GameSession> sessions = new ConcurrentHashMap<>();

    public GameSession createSession(String roomId) {
        Room room = lobby.getRoom(roomId);

        ActiveSession p1 = room.getPlayers().get(0);
        ActiveSession p2 = room.getPlayers().get(1);

        String sessionId = UUID.randomUUID().toString();

        GameSession session = GameSession.builder()
                .id(sessionId)
                .player1(PlayerState.builder()
                        .userId(p1.getUserId())
                        .nickname(p1.getNickname())
                        .build())
                .player2(PlayerState.builder()
                        .userId(p2.getUserId())
                        .nickname(p2.getNickname())
                        .build())
                .roomId(roomId)
                .timerActive(false)
                .build();

        session.getPlayer1().setCurrentHand(cardService.generateInitialHand(p1.getUserId()));
        session.getPlayer2().setCurrentHand(cardService.generateInitialHand(p2.getUserId()));

        gameSessionBroadcaster.broadcastInitialState(session);
        sessions.put(sessionId, session);
        gameSessionBroadcaster.broadcastGameStart(session);

        return session;
    }

    public GameSession getSessionById(String id) {
        return sessions.get(id);
    }

    public void killSession(String id) {
        sessions.remove(id);
    }

    public boolean playerPlayCard(CardPlayDto cardPlayDto) {
        GameSession gameSession = getSessionById(cardPlayDto.sessionId());
        if (gameSession == null) return false;

        PlayerState playerState =
                gameSession.getPlayer1().getUserId().equals(cardPlayDto.userId())
                        ? gameSession.getPlayer1()
                        : gameSession.getPlayer2();

        CardInstance cardInstance = playerState.getCurrentHand().stream()
                .filter(card -> card.instanceId().equals(cardPlayDto.instanceId()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Could not find card"));

        playerState.setSelectedCard(cardInstance);
        playerState.setHasPlayedThisTurn(true);

        boolean bothPlayed = gameSession.getPlayer1().isHasPlayedThisTurn()
                && gameSession.getPlayer2().isHasPlayedThisTurn();

        gameSessionBroadcaster.broadcastSelectCard(gameSession.getId(), cardPlayDto.userId(), cardInstance);

        return bothPlayed;
    }

    public ActiveSession getSessionByUserId(Long userId, String roomId) {
        return lobby.getRoom(roomId).getPlayers().stream()
                .filter(s -> s.getUserId().equals(userId))
                .findFirst()
                .orElse(null);
    }
}