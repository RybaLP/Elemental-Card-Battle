package com.elemental_card_battle.elemental_card_battle.manager;

import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardInstance;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardPlayDto;
import com.elemental_card_battle.elemental_card_battle.model.*;
import com.elemental_card_battle.elemental_card_battle.service.CardService;
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

//
//    public PlayerState getPlayerById(String sessionId, String playerId) {
//        GameSession session = getSessionById(sessionId);
//        if (session == null) throw new IllegalStateException("Session not found");
//
//        if (session.getPlayer1().getPlayerId().equals(playerId)) {
//            return session.getPlayer1();
//        } else if (session.getPlayer2().getPlayerId().equals(playerId)) {
//            return session.getPlayer2();
//        } else {
//            throw new IllegalStateException("Player not found in session");
//        }
//
//    }


    public GameSession createSession (String roomId) {

        Room room = lobby.getRoom(roomId);

        Player p1 = room.getPlayers().get(0);
        Player p2 = room.getPlayers().get(1);

        String sessionId = UUID.randomUUID().toString();

        GameSession session  = GameSession.builder()
                .id(sessionId)
                .player1(PlayerState.builder().playerId(p1.getId()).build())
                .player2(PlayerState.builder().playerId(p2.getId()).build())
                .roomId(roomId)
                .build();

        session.getPlayer1().setCurrentHand(cardService.generateInitialHand());
        session.getPlayer2().setCurrentHand(cardService.generateInitialHand());

        gameSessionBroadcaster.broadcastInitialState(session);

        sessions.put(sessionId, session);

        gameSessionBroadcaster.broadcastGameStart(session);

        return session;
    }

    public GameSession getSessionById (String id) {
        return sessions.get(id);
    }

    public void killSession (String id) {
        sessions.remove(id);
    }


    public boolean playerPlayCard (CardPlayDto cardPlayDto) {

        GameSession gameSession = getSessionById(cardPlayDto.getSessionId());
        if (gameSession == null) return false;

        PlayerState playerState =
                gameSession.getPlayer1().getPlayerId().equals(cardPlayDto.getPlayerId())
                        ? gameSession.getPlayer1()
                        : gameSession.getPlayer2();


        CardInstance cardInstance = playerState.getCurrentHand().stream()
                .filter(card -> card.getInstanceId().equals(cardPlayDto.getInstanceId()))
                        .findFirst()
                            .orElseThrow(() -> new IllegalStateException("Could not find card"));

        playerState.setSelectedCard(cardInstance);
        playerState.setHasPlayedThisTurn(true);


//        gameSessionBroadcaster.broadcastGameUpdate(gameSession);

        boolean bothPlayed =
                gameSession.getPlayer1().isHasPlayedThisTurn() && gameSession.getPlayer2().isHasPlayedThisTurn();

        gameSessionBroadcaster.broadcastSelectCard(gameSession.getId(), cardPlayDto.getPlayerId(), cardInstance);

        return bothPlayed;
    }
}