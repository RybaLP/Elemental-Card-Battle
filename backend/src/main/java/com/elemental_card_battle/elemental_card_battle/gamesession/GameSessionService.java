package com.elemental_card_battle.elemental_card_battle.gamesession;

import com.elemental_card_battle.elemental_card_battle.card.CardService;
import com.elemental_card_battle.elemental_card_battle.card.ElementalType;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardInstance;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardPlayDto;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.PlayRandomCardDto;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.RoundResultDto;
import com.elemental_card_battle.elemental_card_battle.exception.game.GameSessionNotFoundException;
import com.elemental_card_battle.elemental_card_battle.manager.GameSessionManager;
import com.elemental_card_battle.elemental_card_battle.model.*;
import com.elemental_card_battle.elemental_card_battle.roundicon.RoundIconService;
import com.elemental_card_battle.elemental_card_battle.user.User;
import com.elemental_card_battle.elemental_card_battle.user.UserService;
import com.elemental_card_battle.elemental_card_battle.util.GameSessionBroadcaster;
import com.elemental_card_battle.elemental_card_battle.util.TurnTimer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class GameSessionService {

    private final GameSessionManager gameSessionManager;
    private final GameSessionBroadcaster gameSessionBroadcaster;
    private final CardService cardService;
    private final RoundIconService roundIconService;
    private final TurnTimer turnTimer;
    private final UserService userService;

    public void playPlayerCard(CardPlayDto cardPlayDto) {
        GameSession gameSession = gameSessionManager.getSessionById(cardPlayDto.sessionId());
        if (gameSession == null) throw new GameSessionNotFoundException(cardPlayDto.sessionId());

        if (!gameSession.isTimerActive()) {
            gameSession.setTimerActive(true);
            gameSessionBroadcaster.broadcastStartCountdown(gameSession);
            turnTimer.startTimer(gameSession, 7, () -> playRandomCard(new PlayRandomCardDto(gameSession.getId())));
        }

        boolean bothPlayed = gameSessionManager.playerPlayCard(cardPlayDto);

        if (bothPlayed) {
            resolveRound(gameSession);
            gameSessionBroadcaster.broadcastGameUpdate(gameSession);
        }
    }

    public void playRandomCard(PlayRandomCardDto playRandomCardDto) {
        GameSession gameSession = gameSessionManager.getSessionById(playRandomCardDto.gameSessionId());

        PlayerState p1 = gameSession.getPlayer1();
        PlayerState p2 = gameSession.getPlayer2();
        Random random = new Random();

        if (p1.getSelectedCard() == null) {
            CardInstance card = drawRandomCard(p1, random);
            gameSessionBroadcaster.broadcastRandomCard(gameSession, p1.getUserId(), card);
        }

        if (p2.getSelectedCard() == null) {
            CardInstance card = drawRandomCard(p2, random);
            gameSessionBroadcaster.broadcastRandomCard(gameSession, p2.getUserId(), card);
        }

        resolveRound(gameSession);
    }

    private CardInstance drawRandomCard(PlayerState playerState, Random random) {
        List<CardInstance> hand = playerState.getCurrentHand();
        int randomIndex = random.nextInt(hand.size());
        playerState.setSelectedCard(hand.get(randomIndex));
        return playerState.getSelectedCard();
    }

    public void resolveRound(GameSession gameSession) {
        gameSession.setTimerActive(false);
        turnTimer.cancelTimer();
        gameSessionBroadcaster.broadcastStopCountdown(gameSession);

        if (gameSession.isOver()) return;

        PlayerState p1 = gameSession.getPlayer1();
        PlayerState p2 = gameSession.getPlayer2();

        CardInstance p1Card = p1.getSelectedCard();
        CardInstance p2Card = p2.getSelectedCard();

        if (p1Card == null || p2Card == null) return;

        Long roundWinner = getRoundWinner(p1Card, p2Card, p1.getUserId(), p2.getUserId());

        if (roundWinner != null && roundWinner.equals(p1.getUserId())) {
            String imageUrl = roundIconService.getIconUrlByColorAndType(p1Card.color(), p1Card.elementalType());
            p1.getWonRounds().add(WonRound.builder()
                    .color(p1Card.color())
                    .elementalType(p1Card.elementalType())
                    .imageUrl(imageUrl)
                    .build());
        }

        if (roundWinner != null && roundWinner.equals(p2.getUserId())) {
            String imageUrl = roundIconService.getIconUrlByColorAndType(p2Card.color(), p2Card.elementalType());
            p2.getWonRounds().add(WonRound.builder()
                    .color(p2Card.color())
                    .elementalType(p2Card.elementalType())
                    .imageUrl(imageUrl)
                    .build());
        }

        p1.getCurrentHand().remove(p1Card);
        p2.getCurrentHand().remove(p2Card);
        p1.getCurrentHand().add(cardService.generateRandomCard());
        p2.getCurrentHand().add(cardService.generateRandomCard());

        p1.setSelectedCard(null);
        p1.setHasPlayedThisTurn(false);
        p2.setSelectedCard(null);
        p2.setHasPlayedThisTurn(false);

        RoundResultDto roundResultDto = new RoundResultDto(
                roundWinner,
                p1.getUserId(),
                p2.getUserId(),
                p1.getWonRounds(),
                p2.getWonRounds(),
                p1Card,
                p2Card,
                p1.getCurrentHand(),
                p2.getCurrentHand()
        );

        gameSessionBroadcaster.broadcastRoundWinner(gameSession.getId(), roundResultDto);

        Long gameWinnerId = checkIfSomeoneWon(gameSession);

        if (gameWinnerId != null) {
            gameSession.setWinnerId(gameWinnerId);
            Long loserId = gameWinnerId.equals(p1.getUserId()) ? p2.getUserId() : p1.getUserId();
            String winnerNickname = gameWinnerId.equals(p1.getUserId()) ? p1.getNickname() : p2.getNickname();

            handleGameOver(gameWinnerId, loserId);
            gameSessionBroadcaster.broadcastGameOver(gameSession, winnerNickname);
            gameSession.setOver(true);
        }
    }

    @Transactional
    protected void handleGameOver(Long winnerId, Long loserId) {
        int reward = new Random().nextInt(21) + 10;

        if (winnerId > 0) {
            User winner = userService.findUserById(winnerId);
            winner.setGamesWon(winner.getGamesWon() + 1);
            winner.setCurrency(winner.getCurrency() + reward);
        }

        if (loserId > 0) {
            User loser = userService.findUserById(loserId);
            loser.setGamesLost(loser.getGamesLost() + 1);
        }

    }

    private Long getRoundWinner(CardInstance p1Card, CardInstance p2Card, Long p1Id, Long p2Id) {
        if (p1Card.elementalType().equals(p2Card.elementalType())) {
            if (p1Card.power() > p2Card.power()) return p1Id;
            if (p2Card.power() > p1Card.power()) return p2Id;
            return null;
        }

        if (p1Card.elementalType().equals(ElementalType.FIRE) && p2Card.elementalType().equals(ElementalType.ICE)
                || p1Card.elementalType().equals(ElementalType.WATER) && p2Card.elementalType().equals(ElementalType.FIRE)
                || p1Card.elementalType().equals(ElementalType.ICE) && p2Card.elementalType().equals(ElementalType.WATER)) {
            return p1Id;
        } else {
            return p2Id;
        }
    }

    private Long checkIfSomeoneWon(GameSession gameSession) {
        PlayerState p1 = gameSession.getPlayer1();
        PlayerState p2 = gameSession.getPlayer2();

        if (hasPlayerWon(p1)) return p1.getUserId();
        if (hasPlayerWon(p2)) return p2.getUserId();

        return null;
    }

    private boolean hasPlayerWon(PlayerState playerState) {
        List<WonRound> rounds = playerState.getWonRounds();

        Map<String, Integer> fireCounts = new HashMap<>();
        Map<String, Integer> iceCounts = new HashMap<>();
        Map<String, Integer> waterCounts = new HashMap<>();

        for (WonRound round : rounds) {
            String color = round.getColor();
            ElementalType elementalType = round.getElementalType();

            if (elementalType.equals(ElementalType.ICE)) {
                iceCounts.put(color, iceCounts.getOrDefault(color, 0) + 1);
            }
            if (elementalType.equals(ElementalType.FIRE)) {
                fireCounts.put(color, fireCounts.getOrDefault(color, 0) + 1);
            }
            if (elementalType.equals(ElementalType.WATER)) {
                waterCounts.put(color, waterCounts.getOrDefault(color, 0) + 1);
            }
        }

        if (fireCounts.containsValue(3) || waterCounts.containsValue(3) || iceCounts.containsValue(3)) {
            return true;
        }

        for (String color : fireCounts.keySet()) {
            if (iceCounts.containsKey(color) && waterCounts.containsKey(color)) {
                return true;
            }
        }

        return false;
    }
}