package com.elemental_card_battle.elemental_card_battle.util;

import com.elemental_card_battle.elemental_card_battle.dto.gamesession.RoundResultDto;
import com.elemental_card_battle.elemental_card_battle.model.Card;
import com.elemental_card_battle.elemental_card_battle.model.GameSession;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class GameSessionBroadcaster {
    private final SimpMessagingTemplate simpMessagingTemplate;

    public void broadcastGameStart(GameSession session) {
        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + session.getRoomId(),
                Map.of(
                        "event", "gameStart",
                        "session" , session,
                        "sessionId", session.getId(),
                        "player1", session.getPlayer1().getPlayerId(),
                        "player2", session.getPlayer2().getPlayerId()
                )
        );
    }


    public void broadcastInitialState (GameSession gameSession) {
        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + gameSession.getId() + "/state",
                Map.of("event" , "fullState",
                        "session", gameSession)
        );
    }


    public void broadcastGameUpdate (GameSession gameSession) {
        simpMessagingTemplate.convertAndSend("/topic/game/" + gameSession.getId() + "/state",
                Map.of("event" , "GAME_STATE_UPDATE",
                        "session", gameSession));
    }

    public void broadcastSelectCard(String sessionId, String playerId, Card card) {
        simpMessagingTemplate.convertAndSend("/topic/game/" + sessionId + "/card",
                Map.of(
                        "event", "CARD_SELECTED",
                        "playerId", playerId,
                        "card", card
                )
        );
    }

    public void broadcastRoundWinner (String sessionId, RoundResultDto roundResultDto) {
        Map<String, Object> payload = Map.of(
                "event" , "roundResult",
                "winnerId" , roundResultDto.getWinnerId(),
                "p1Id" , roundResultDto.getP1Id(),
                "p2Id" , roundResultDto.getP2Id(),
                "p1Rounds" , roundResultDto.getP1WonRounds(),
                "p2Rounds" , roundResultDto.getP2WonRounds()
        );

        simpMessagingTemplate.convertAndSend("/topic/game/" + sessionId + "/winner", payload);
    }
}