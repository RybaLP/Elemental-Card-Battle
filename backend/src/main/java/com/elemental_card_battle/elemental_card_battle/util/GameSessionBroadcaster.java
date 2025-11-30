package com.elemental_card_battle.elemental_card_battle.util;

import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardInstance;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.RoundResultDto;
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

    public void broadcastSelectCard(String sessionId, String playerId, CardInstance card) {
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
                "p2Rounds" , roundResultDto.getP2WonRounds(),
                "p1Cards" , roundResultDto.getP1Cards(),
                "p2Cards", roundResultDto.getP2Cards()
        );

        simpMessagingTemplate.convertAndSend("/topic/game/" + sessionId + "/winner", payload);
    }


    public void broadcastCountDown (GameSession gameSession, int timeLeft) {
        simpMessagingTemplate.convertAndSend("/topic/game/" + gameSession.getId() + "/countdown",
                Map.of(
                        "event", "countDown",
                        "seconds", timeLeft
                ));
    }

    public void broadcastStartCountdown (GameSession gameSession) {
        simpMessagingTemplate.convertAndSend("/topic/game/" + gameSession.getId() + "/countdown/start",
                Map.of(
                        "event" , "startCountdown"
                )
        );
    }

    public void broadcastStopCountdown (GameSession gameSession) {
        simpMessagingTemplate.convertAndSend("/topic/game/" + gameSession.getId() + "/countdown/stop",
                Map.of("event", "stopCountdown"));
    }

    public void broadcastRandomCard(GameSession gameSession, String playerId, CardInstance cardInstance) {
        Map<String, Object> payload = Map.of(
                "event", "randomCard",
                "playerId", playerId,
                "card" , cardInstance
        );
        simpMessagingTemplate.convertAndSend("/topic/game/" + gameSession.getId() + "/randomCard", payload);
    }


    public void broadcastGameOver(GameSession gameSession, String winerNickname) {
        simpMessagingTemplate.convertAndSend("/topic/game/" + gameSession.getId() + "/game-over",
                Map.of(
                        "event" , "gameOver",
                        "gameWiner" , winerNickname,
                        "message" , "GAME OVER, player" + winerNickname + "won the game!"
                ));
    }
}