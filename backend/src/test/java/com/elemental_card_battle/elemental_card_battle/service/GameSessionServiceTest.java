package com.elemental_card_battle.elemental_card_battle.service;

import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardInstance;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardPlayDto;
import com.elemental_card_battle.elemental_card_battle.exception.game.GameSessionNotFoundException;
import com.elemental_card_battle.elemental_card_battle.manager.GameSessionManager;
import com.elemental_card_battle.elemental_card_battle.model.*;
import com.elemental_card_battle.elemental_card_battle.util.GameSessionBroadcaster;
import com.elemental_card_battle.elemental_card_battle.util.TurnTimer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GameSession service unit tests")
class GameSessionServiceTest {

    @Mock private GameSessionManager gameSessionManager;
    @Mock private GameSessionBroadcaster gameSessionBroadcaster;
    @Mock private CardService cardService;
    @Mock private RoundIconService roundIconService;
    @Mock private TurnTimer turnTimer;

    @InjectMocks
    private GameSessionService gameSessionService;

    private GameSession gameSession;
    private PlayerState p1;
    private PlayerState p2;
    private CardInstance fireCard;
    private CardInstance iceCard;
    private CardInstance waterCard;

    @BeforeEach
    void setup() {
        fireCard = new CardInstance("fire-instance-id", 1L, 5, "Fire Card", "RED", "FIRE", "fire.png");
        iceCard = new CardInstance("ice-instance-id", 2L, 3, "Ice Card", "BLUE", "ICE", "ice.png");
        waterCard = new CardInstance("water-instance-id", 3L, 4, "Water Card", "BLUE", "WATER", "water.png");

        p1 = PlayerState.builder()
                .playerId("p1-id")
                .currentHand(new ArrayList<>(List.of(fireCard)))
                .wonRounds(new ArrayList<>())
                .build();

        p2 = PlayerState.builder()
                .playerId("p2-id")
                .currentHand(new ArrayList<>(List.of(iceCard)))
                .wonRounds(new ArrayList<>())
                .build();

        gameSession = GameSession.builder()
                .id("session-id")
                .player1(p1)
                .player2(p2)
                .timerActive(false)
                .build();
    }

    @Nested
    @DisplayName("playPlayerCard tests")
    class PlayPlayerCard {

        @Test
        @DisplayName("Should throw GameSessionNotFoundException when session not found")
        void shouldThrowWhenSessionNotFound() {
            when(gameSessionManager.getSessionById("session-id")).thenReturn(null);

            assertThrows(GameSessionNotFoundException.class,
                    () -> gameSessionService.playPlayerCard(new CardPlayDto("session-id", "fire-instance-id", "p1-id")));
        }
    }

    @Nested
    @DisplayName("resolveRound tests")
    class ResolveRound {

        @Test
        @DisplayName("Should not resolve when one card is null")
        void shouldNotResolveWhenOneCardIsNull() {
            p1.setSelectedCard(fireCard);
            p2.setSelectedCard(null);

            gameSessionService.resolveRound(gameSession);

            assertTrue(p1.getWonRounds().isEmpty());
            assertTrue(p2.getWonRounds().isEmpty());
        }

        @Test
        @DisplayName("Should give point to p1 when FIRE beats ICE")
        void shouldGivePointToP1WhenFireBeatsIce() {
            p1.setSelectedCard(fireCard);
            p2.setSelectedCard(iceCard);

            when(roundIconService.getIconUrlByColorAndType("RED", "FIRE")).thenReturn("icon.png");
            when(cardService.generateRandomCard()).thenReturn(fireCard);

            gameSessionService.resolveRound(gameSession);

            assertEquals(1, p1.getWonRounds().size());
            assertTrue(p2.getWonRounds().isEmpty());
        }

        @Test
        @DisplayName("Should give point to p2 when ICE beats WATER")
        void shouldGivePointToP2WhenIceBeatsWater() {
            p1.setSelectedCard(waterCard);
            p2.setSelectedCard(iceCard);

            when(roundIconService.getIconUrlByColorAndType("BLUE", "ICE")).thenReturn("icon.png");
            when(cardService.generateRandomCard()).thenReturn(fireCard);

            gameSessionService.resolveRound(gameSession);

            assertTrue(p1.getWonRounds().isEmpty());
            assertEquals(1, p2.getWonRounds().size());
        }

        @Test
        @DisplayName("Should give point to higher power when same elemental type")
        void shouldGivePointToHigherPowerWhenSameType() {
            CardInstance strongFire = new CardInstance("strong-fire", 1L, 10, "Strong Fire", "RED", "FIRE", "fire.png");
            CardInstance weakFire = new CardInstance("weak-fire", 1L, 2, "Weak Fire", "RED", "FIRE", "fire.png");

            p1.setSelectedCard(strongFire);
            p2.setSelectedCard(weakFire);

            when(roundIconService.getIconUrlByColorAndType("RED", "FIRE")).thenReturn("icon.png");
            when(cardService.generateRandomCard()).thenReturn(fireCard);

            gameSessionService.resolveRound(gameSession);

            assertEquals(1, p1.getWonRounds().size());
            assertTrue(p2.getWonRounds().isEmpty());
        }

        @Test
        @DisplayName("Should return draw when same type and same power")
        void shouldReturnDrawWhenSameTypeAndPower() {
            CardInstance fire1 = new CardInstance("fire1", 1L, 5, "Fire", "RED", "FIRE", "fire.png");
            CardInstance fire2 = new CardInstance("fire2", 1L, 5, "Fire", "RED", "FIRE", "fire.png");

            p1.setSelectedCard(fire1);
            p2.setSelectedCard(fire2);

            when(cardService.generateRandomCard()).thenReturn(fireCard);

            gameSessionService.resolveRound(gameSession);

            assertTrue(p1.getWonRounds().isEmpty());
            assertTrue(p2.getWonRounds().isEmpty());
        }

        @Test
        @DisplayName("Should not resolve when session is already over")
        void shouldNotResolveWhenSessionIsOver() {
            gameSession.setOver(true);

            gameSessionService.resolveRound(gameSession);

            assertTrue(p1.getWonRounds().isEmpty());
            assertTrue(p2.getWonRounds().isEmpty());
        }
    }
}