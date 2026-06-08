package com.elemental_card_battle.elemental_card_battle.service;

import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardInstance;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardPlayDto;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.PlayRandomCardDto;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.RoundResultDto;
import com.elemental_card_battle.elemental_card_battle.exception.game.GameSessionNotFoundException;
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

        GameSession gameSession = gameSessionManager.getSessionById(cardPlayDto.sessionId());
        if (gameSession == null) throw new GameSessionNotFoundException(cardPlayDto.sessionId());

        if (!gameSession.isTimerActive()) {
            gameSession.setTimerActive(true);
            gameSessionBroadcaster.broadcastStartCountdown(gameSession);
            turnTimer.startTimer(gameSession,7,() -> playRandomCard(new PlayRandomCardDto(gameSession.getId())));
        }


        boolean bothPlayed = gameSessionManager.playerPlayCard(cardPlayDto);

        if (bothPlayed) {
            resolveRound(gameSession);
            gameSessionBroadcaster.broadcastGameUpdate(gameSession);
        }
    }


    public void playRandomCard (PlayRandomCardDto playRandomCardDto) {

        GameSession gameSession = gameSessionManager.getSessionById(playRandomCardDto.gameSessionId());

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

            String imageUrl = roundIconService.getIconUrlByColorAndType(p1Card.color(), p1Card.elementalType());

            WonRound wonRound = WonRound.builder()
                    .color(p1Card.color())
                    .elementalType(p1Card.elementalType())
                    .imageUrl(imageUrl)
                    .build();

            p1.getWonRounds().add(wonRound);
        }

//        case 2 : p2 gets point
        if (roundWinner.equals(p2.getPlayerId())) {

            String imageUrl = roundIconService.getIconUrlByColorAndType(p2Card.color(), p2Card.elementalType());

            WonRound wonRound = WonRound.builder()
                    .color(p2Card.color())
                    .elementalType(p2Card.elementalType())
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

        RoundResultDto roundResultDto = new RoundResultDto(
                roundWinner,
                p1.getPlayerId(),
                p2.getPlayerId(),
                p1.getWonRounds(),
                p2.getWonRounds(),
                p1Card,
                p2Card,
                p1.getCurrentHand(),
                p2.getCurrentHand()
        );

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
        if (p1Card.elementalType().equals(p2Card.elementalType())) {
//            p1 win
            if (p1Card.power() > p2Card.power()) {
                return p1Id;
            }
//            p2 win
            if (p2Card.power() > p1Card.power()) {
                return p2Id;
            }
//            draw
            return "none";
        }

//        if elemental types are different...
        if (p1Card.elementalType().equals("FIRE") && p2Card.elementalType().equals("ICE")
                || p1Card.elementalType().equals("WATER") && p2Card.elementalType().equals("FIRE")
                || p1Card.elementalType().equals("ICE") && p2Card.elementalType().equals("WATER")) {
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

        Map<String, Integer> fireCounts = new HashMap<>();
        Map<String, Integer> iceCounts = new HashMap<>();
        Map<String, Integer> waterCounts = new HashMap<>();

        for (WonRound round : rounds) {

            String color = round.getColor();
            String elementalType = round.getElementalType();

            if (elementalType.equals("ICE")) {
                iceCounts.put(color, iceCounts.getOrDefault(color, 0) + 1);
            }

            if (elementalType.equals("FIRE")) {
                fireCounts.put(color, fireCounts.getOrDefault(color, 0) + 1);
            }

            if (elementalType.equals("WATER")) {
                waterCounts.put(color, waterCounts.getOrDefault(color, 0) + 1);
            }

        }
// Win condition : Player ollected the same color from the same elemental type
        if (fireCounts.containsValue(3) || waterCounts.containsValue(3) || iceCounts.containsValue(3)) {
            return true;
        }

// Win condition: Player collected the same color from all three elemental types
        for (String color : fireCounts.keySet()) {
            if (iceCounts.containsKey(color) && waterCounts.containsKey(color)) {
                return true;
            }
        }

        return false;
    }
}