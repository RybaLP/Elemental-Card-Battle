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
                        "session", session,
                        "sessionId", session.getId(),
                        "player1", session.getPlayer1().getUserId(),
                        "player2", session.getPlayer2().getUserId()
                )
        );
    }

    public void broadcastInitialState(GameSession gameSession) {
        simpMessagingTemplate.convertAndSend(
                "/topic/game/" + gameSession.getId() + "/state",
                Map.of("event", "fullState", "session", gameSession)
        );
    }

    public void broadcastGameUpdate(GameSession gameSession) {
        simpMessagingTemplate.convertAndSend("/topic/game/" + gameSession.getId() + "/state",
                Map.of("event", "GAME_STATE_UPDATE", "session", gameSession));
    }

    public void broadcastSelectCard(String sessionId, Long userId, CardInstance card) {
        simpMessagingTemplate.convertAndSend("/topic/game/" + sessionId + "/card",
                Map.of(
                        "event", "CARD_SELECTED",
                        "userId", userId,
                        "card", card
                )
        );
    }

    public void broadcastRoundWinner(String sessionId, RoundResultDto roundResultDto) {
        simpMessagingTemplate.convertAndSend("/topic/game/" + sessionId + "/winner",
                Map.of(
                        "event", "roundResult",
                        "winnerId", roundResultDto.winnerId(),
                        "p1Id", roundResultDto.p1Id(),
                        "p2Id", roundResultDto.p2Id(),
                        "p1Rounds", roundResultDto.p1WonRounds(),
                        "p2Rounds", roundResultDto.p2WonRounds(),
                        "p1Cards", roundResultDto.p1Cards(),
                        "p2Cards", roundResultDto.p2Cards()
                )
        );
    }

    public void broadcastCountDown(GameSession gameSession, int timeLeft) {
        simpMessagingTemplate.convertAndSend("/topic/game/" + gameSession.getId() + "/countdown",
                Map.of("event", "countDown", "seconds", timeLeft));
    }

    public void broadcastStartCountdown(GameSession gameSession) {
        simpMessagingTemplate.convertAndSend("/topic/game/" + gameSession.getId() + "/countdown/start",
                Map.of("event", "startCountdown"));
    }

    public void broadcastStopCountdown(GameSession gameSession) {
        simpMessagingTemplate.convertAndSend("/topic/game/" + gameSession.getId() + "/countdown/stop",
                Map.of("event", "stopCountdown"));
    }

    public void broadcastRandomCard(GameSession gameSession, Long userId, CardInstance cardInstance) {
        simpMessagingTemplate.convertAndSend("/topic/game/" + gameSession.getId() + "/randomCard",
                Map.of(
                        "event", "randomCard",
                        "userId", userId,
                        "card", cardInstance
                )
        );
    }

    public void broadcastGameOver(GameSession gameSession, String winnerNickname) {
        simpMessagingTemplate.convertAndSend("/topic/game/" + gameSession.getId() + "/game-over",
                Map.of(
                        "event", "gameOver",
                        "gameWinner", winnerNickname,
                        "message", "GAME OVER, player " + winnerNickname + " won the game!"
                ));
    }
}