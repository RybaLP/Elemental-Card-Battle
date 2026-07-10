package com.elemental_card_battle.elemental_card_battle.gamesession;

import com.elemental_card_battle.elemental_card_battle.card.CardService;
import com.elemental_card_battle.elemental_card_battle.card.ElementalType;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardInstance;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.RoundResultDto;
import com.elemental_card_battle.elemental_card_battle.model.GameSession;
import com.elemental_card_battle.elemental_card_battle.model.PlayerState;
import com.elemental_card_battle.elemental_card_battle.model.WonRound;
import com.elemental_card_battle.elemental_card_battle.roundicon.RoundIconService;
import com.elemental_card_battle.elemental_card_battle.user.UserService;
import com.elemental_card_battle.elemental_card_battle.util.GameSessionBroadcaster;
import com.elemental_card_battle.elemental_card_battle.util.TurnTimer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameSessionService {

    private final GameSessionManager gameSessionManager;
    private final GameSessionBroadcaster gameSessionBroadcaster;
    private final RoundIconService roundIconService;
    private final TurnTimer turnTimer;
    private final CardService cardService;
    private final UserService userService;

    public void playPlayerCard(Long userId, Integer instanceId) {
        log.info("playPlayerCard called: userId={}, instanceId={}", userId, instanceId);

        GameSession gameSession = gameSessionManager.findSessionByUserId(userId);

        if (gameSession == null || gameSession.isOver()) {
            log.warn("GameSession is null or over");
            return;
        }

        PlayerState player = gameSession.getPlayerState(userId);
        if (player.isHasPlayedThisTurn()) {
            log.warn("Player {} already played this turn", player.getNickname());
            return;
        }

        log.info("Player found: {}, hasPlayedThisTurn={}", player.getNickname(), player.isHasPlayedThisTurn());
        log.info("Player hand size: {}", player.getCurrentHand().size());
        player.getCurrentHand().forEach(c ->
                log.info("Hand card: instanceId={}, name={}", c.instanceId(), c.name())
        );

        CardInstance card = player.getCurrentHand().stream()
                .filter(c -> c.instanceId().equals(instanceId))
                .findFirst()
                .orElse(null);

        if (card == null) {
            log.warn("Card not found in hand. Looking for instanceId: {}", instanceId);
            return;
        }

        log.info("Card found: {}", card.name());

        player.setSelectedCard(card);
        player.setHasPlayedThisTurn(true);

        gameSessionBroadcaster.broadcastSelectCard(gameSession.getId(), userId, card);

        if (!gameSession.isTimerActive()) {
            gameSession.setTimerActive(true);
            gameSessionBroadcaster.broadcastStartCountdown(gameSession);
            turnTimer.startTimer(gameSession, 7, () -> playRandomCard(gameSession));
        }

        boolean bothPlayed = gameSession.getPlayer1().isHasPlayedThisTurn()
                && gameSession.getPlayer2().isHasPlayedThisTurn();

        log.info("Timer active: {}, both played: {}", gameSession.isTimerActive(), bothPlayed);

        if (bothPlayed) {
            resolveRound(gameSession);
        }
    }

    public void playRandomCard(GameSession gameSession) {
        if (gameSession.isOver()) return;
        PlayerState player = checkWhoDidntPlay(gameSession);
        if (player == null) return;
        List<CardInstance> hand = player.getCurrentHand();
        if (hand.isEmpty()) return;
        Random random = new Random();
        CardInstance randomCard = hand.get(random.nextInt(hand.size()));
        playPlayerCard(player.getUserId(), randomCard.instanceId());
    }

    private PlayerState checkWhoDidntPlay(GameSession gameSession) {
        if (!gameSession.getPlayer1().isHasPlayedThisTurn()) {
            return gameSession.getPlayer1();
        }
        if (!gameSession.getPlayer2().isHasPlayedThisTurn()) {
            return gameSession.getPlayer2();
        }
        return null;
    }

    private boolean hasPlayerWon(PlayerState playerState) {
        List<WonRound> wonRounds = playerState.getWonRounds();

        Map<String, Integer> fire = new HashMap<>();
        Map<String, Integer> water = new HashMap<>();
        Map<String, Integer> ice = new HashMap<>();

        for (WonRound round : wonRounds) {
            String color = round.getColor();
            ElementalType elementType = round.getElementalType();
            switch (elementType) {
                case FIRE -> fire.put(color, fire.getOrDefault(color, 0) + 1);
                case ICE -> ice.put(color, ice.getOrDefault(color, 0) + 1);
                case WATER -> water.put(color, water.getOrDefault(color, 0) + 1);
            }
        }

        if (fire.containsValue(3) || water.containsValue(3) || ice.containsValue(3)) {
            return true;
        }

        for (String color : fire.keySet()) {
            if (ice.containsKey(color) && water.containsKey(color)) {
                return true;
            }
        }
        return false;
    }

    private Long checkIfSomeoneWon(GameSession gameSession) {
        if (hasPlayerWon(gameSession.getPlayer1())) return gameSession.getPlayer1().getUserId();
        if (hasPlayerWon(gameSession.getPlayer2())) return gameSession.getPlayer2().getUserId();
        return null;
    }

    public void resolveRound(GameSession gameSession) {
        gameSession.setTimerActive(false);
        turnTimer.cancelTimer(gameSession);
        gameSessionBroadcaster.broadcastStopCountdown(gameSession);

        if (gameSession.isOver()) return;

        PlayerState p1 = gameSession.getPlayer1();
        PlayerState p2 = gameSession.getPlayer2();

        CardInstance p1Card = p1.getSelectedCard();
        CardInstance p2Card = p2.getSelectedCard();
        if (p1Card == null || p2Card == null) return;

        Long winnerId = getRoundWinner(p1Card, p2Card, p1.getUserId(), p2.getUserId());

        if (winnerId != null) {
            PlayerState winner = winnerId.equals(p1.getUserId()) ? p1 : p2;
            CardInstance winningCard = winnerId.equals(p1.getUserId()) ? p1Card : p2Card;
            winner.getWonRounds().add(createWonRound(winningCard));
        }

        p1.getCurrentHand().remove(p1Card);
        p2.getCurrentHand().remove(p2Card);
        p1.getCurrentHand().add(cardService.generateRandomCard());
        p2.getCurrentHand().add(cardService.generateRandomCard());

        resetPlayerTurnState(p1);
        resetPlayerTurnState(p2);

        sendRoundResult(gameSession, winnerId, p1Card, p2Card);

        Long gameWinnerId = checkIfSomeoneWon(gameSession);
        if (gameWinnerId != null) {
            String winnerNickname = gameSession.getPlayerState(gameWinnerId).getNickname();
            handleGameOver(gameSession, gameWinnerId, winnerNickname);
        }
    }

    private Long getRoundWinner(CardInstance p1Card, CardInstance p2Card, Long p1Id, Long p2Id) {
        if (p1Card.elementalType().equals(p2Card.elementalType())) {
            if (p1Card.power() > p2Card.power()) return p1Id;
            if (p2Card.power() > p1Card.power()) return p2Id;
            return null;
        }
        boolean p1Wins = (p1Card.elementalType() == ElementalType.FIRE && p2Card.elementalType() == ElementalType.ICE) ||
                (p1Card.elementalType() == ElementalType.WATER && p2Card.elementalType() == ElementalType.FIRE) ||
                (p1Card.elementalType() == ElementalType.ICE && p2Card.elementalType() == ElementalType.WATER);
        return p1Wins ? p1Id : p2Id;
    }

    private void resetPlayerTurnState(PlayerState player) {
        player.setSelectedCard(null);
        player.setHasPlayedThisTurn(false);
    }

    private WonRound createWonRound(CardInstance card) {
        String imageUrl = roundIconService.getIconUrlByColorAndType(card.color(), card.elementalType());
        return WonRound.builder()
                .color(card.color())
                .elementalType(card.elementalType())
                .imageUrl(imageUrl)
                .build();
    }

    private void sendRoundResult(GameSession gameSession, Long winnerId, CardInstance p1Card, CardInstance p2Card) {
        PlayerState p1 = gameSession.getPlayer1();
        PlayerState p2 = gameSession.getPlayer2();

        RoundResultDto dto = new RoundResultDto(
                winnerId,
                p1.getUserId(),
                p2.getUserId(),
                p1.getWonRounds(),
                p2.getWonRounds(),
                p1Card,
                p2Card,
                p1.getCurrentHand(),
                p2.getCurrentHand()
        );

        gameSessionBroadcaster.broadcastRoundWinner(gameSession.getId(), dto);
    }

    private void handleGameOver(GameSession gameSession, Long winnerId, String winnerNickname) {
        gameSession.setOver(true);
        gameSession.setWinnerId(winnerId);
        turnTimer.cancelTimer(gameSession);

        Long loserId = winnerId.equals(gameSession.getPlayer1().getUserId())
                ? gameSession.getPlayer2().getUserId()
                : gameSession.getPlayer1().getUserId();

        userService.updateStats(winnerId, true);
        userService.updateStats(loserId, false);

        gameSessionBroadcaster.broadcastGameOver(gameSession, winnerNickname);
        gameSessionManager.killSession(gameSession.getId());
    }
}