package com.elemental_card_battle.elemental_card_battle.service;

import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardInstance;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardPlayDto;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.RoundResultDto;
import com.elemental_card_battle.elemental_card_battle.manager.GameSessionManager;
import com.elemental_card_battle.elemental_card_battle.model.*;
import com.elemental_card_battle.elemental_card_battle.util.GameSessionBroadcaster;
import com.elemental_card_battle.elemental_card_battle.util.TurnTimer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class GameSessionService  {

    private final GameSessionManager gameSessionManager;
    private final GameSessionBroadcaster gameSessionBroadcaster;
    private final CardService cardService;
    private final RoundIconService roundIconService;
    private final TurnTimer turnTimer;

    public void playPlayerCard (CardPlayDto cardPlayDto) {

        GameSession gameSession = gameSessionManager.getSessionById(cardPlayDto.getSessionId());

        if (gameSession.isTimerActive() == false) {
            gameSession.setTimerActive(true);
            gameSessionBroadcaster.broadcastStartCountdown(gameSession);
            turnTimer.startTimer(gameSession,7,() -> playRandomCard(gameSession.getId()));
        }


        boolean bothPlayed = gameSessionManager.playerPlayCard(cardPlayDto);

        if (bothPlayed) {
            resolveRound(gameSession);
            gameSessionBroadcaster.broadcastGameUpdate(gameSession);
        }
    }


    public void playRandomCard (String gameSessionId) {

        GameSession gameSession = gameSessionManager.getSessionById(gameSessionId);

        try {

            PlayerState p1 = gameSession.getPlayer1();
            PlayerState p2 = gameSession.getPlayer2();
            Random random = new Random();

            if (p1.getSelectedCard() == null) {
                CardInstance card = drawRandomCard(p1,random);
                gameSessionBroadcaster.broadcastRandomCard(gameSession, p1.getPlayerId(),card);
            }

            if (p2.getSelectedCard() == null){
                CardInstance card = drawRandomCard(p2,random);
                gameSessionBroadcaster.broadcastRandomCard(gameSession, p2.getPlayerId(), card);
            }

            resolveRound(gameSession);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

//    generating random card from currenthand
    private CardInstance drawRandomCard (PlayerState playerState, Random random) {
            List<CardInstance> hand = playerState.getCurrentHand();
            int randomIndex = random.nextInt(hand.size());
            playerState.setSelectedCard(hand.get(randomIndex));
            return playerState.getSelectedCard();
    }

    public void resolveRound (GameSession gameSession) {

//        stop timer
        gameSession.setTimerActive(false);
        turnTimer.cancelTimer();

        gameSessionBroadcaster.broadcastStopCountdown(gameSession);

//        checking if session has finished
        if (gameSession.isOver()) return;

        PlayerState p1 = gameSession.getPlayer1();
        PlayerState p2 = gameSession.getPlayer2();

        CardInstance p1Card = p1.getSelectedCard();
        CardInstance p2Card = p2.getSelectedCard();

//        waits for both players select their card to play
        if (p1Card == null || p2Card == null) return;

//        signing round winner
        String roundWinner = getRoundWinner(p1Card,p2Card,p1.getPlayerId(),p2.getPlayerId());


//       case 1 : p1 gets point
        if (roundWinner.equals(p1.getPlayerId())) {

            String imageUrl = roundIconService.getIconUrlByColorAndType(p1Card.getColor(), p1Card.getElementalType());

            WonRound wonRound = WonRound.builder()
                    .color(p1Card.getColor())
                    .elementalType(p1Card.getElementalType())
                    .imageUrl(imageUrl)
                    .build();

            p1.getWonRounds().add(wonRound);
        }

//        case 2 : p2 gets point
        if (roundWinner.equals(p2.getPlayerId())) {

            String imageUrl = roundIconService.getIconUrlByColorAndType(p2Card.getColor(), p2Card.getElementalType());

            WonRound wonRound = WonRound.builder()
                    .color(p2Card.getColor())
                    .elementalType(p2Card.getElementalType())
                    .imageUrl(imageUrl)
                    .build();

            p2.getWonRounds().add(wonRound);
        }

//        remove played card
        p1.getCurrentHand().remove(p1Card);
        p2.getCurrentHand().remove(p2Card);

//        add new card
        p1.getCurrentHand().add(cardService.generateRandomCard());
        p2.getCurrentHand().add(cardService.generateRandomCard());

//        clearing for the next round
        p1.setSelectedCard(null);
        p1.setHasPlayedThisTurn(false);
        p2.setSelectedCard(null);
        p2.setHasPlayedThisTurn(false);

        RoundResultDto roundResultDto = RoundResultDto.builder()
                        .winnerId(roundWinner)
                                .p1WonRounds(p1.getWonRounds())
                                        .p2WonRounds(p2.getWonRounds())
                                            .p1Id(p1.getPlayerId())
                                                .p2Id(p2.getPlayerId())
                                                    .p1Cards(p1.getCurrentHand())
                                                        .p2Cards(p2.getCurrentHand())
                                                            .build();

        gameSessionBroadcaster.broadcastRoundWinner(gameSession.getId(), roundResultDto);


        String gameWinnerId  = checkIfSomeoneWon(gameSession);

        if (gameWinnerId != null) {
            gameSession.setWinnerId(gameWinnerId);
            Player player = gameSessionManager.getPlayerById(gameWinnerId);

            gameSessionBroadcaster.broadcastGameOver(gameSession,player.getNickname());
            gameSession.setOver(true);
        }
    }

    private String getRoundWinner (CardInstance p1Card, CardInstance p2Card, String p1Id, String p2Id) {

        // if both players played card with the exact same elemental type (higher power wins)
        if (p1Card.getElementalType().equals(p2Card.getElementalType())) {
//            p1 win
            if (p1Card.getPower() > p2Card.getPower()) {
                return p1Id;
            }
//            p2 win
            if (p2Card.getPower() > p1Card.getPower()) {
                return p2Id;
            }
//            draw
            return "none";
        }

//        if elemental types are different...
        if (p1Card.getElementalType().equals("FIRE") && p2Card.getElementalType().equals("ICE")
                || p1Card.getElementalType().equals("WATER") && p2Card.getElementalType().equals("FIRE")
                || p1Card.getElementalType().equals("ICE") && p2Card.getElementalType().equals("WATER")) {
            return p1Id;
        } else {
            return p2Id;
        }
    }

    private String checkIfSomeoneWon (GameSession gameSession) {
        PlayerState p1 = gameSession.getPlayer1();
        PlayerState p2 = gameSession.getPlayer2();

        if (hasPlayerWon(p1)) return p1.getPlayerId();
        if (hasPlayerWon(p2)) return p2.getPlayerId();

        return null;
    }


    private boolean hasPlayerWon(PlayerState playerState) {
        List<WonRound> rounds = playerState.getWonRounds();

        Map<String, Integer> colorCounts = new HashMap<>();

        for (WonRound round : rounds) {
            String color = round.getColor();
            colorCounts.put(color, colorCounts.getOrDefault(color, 0) + 1);
        }

        for (int count : colorCounts.values()) {
            if (count >= 3) {
                return true;
            }
        }

        return false;
    }

}