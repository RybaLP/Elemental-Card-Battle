package com.elemental_card_battle.elemental_card_battle.controller;

import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardPlayDto;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.PlayRandomCardDto;
import com.elemental_card_battle.elemental_card_battle.manager.GameSessionManager;
import com.elemental_card_battle.elemental_card_battle.model.GameSession;
import com.elemental_card_battle.elemental_card_battle.service.GameSessionService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/game")
@RestController
@RequiredArgsConstructor
public class GameSessionController {

    private final GameSessionService gameSessionService;
    private final GameSessionManager gameSessionManager;

    @Operation(summary = "Start game", description = "Creates a new game session for the given room")
    @PostMapping("/start/{roomId}")
    public ResponseEntity<GameSession> startGame (@PathVariable String roomId) {
        GameSession gameSession = gameSessionManager.createSession(roomId);
        return ResponseEntity.ok(gameSession);
    }

    @Operation(summary = "Play selected card", description = "Plays a specific card chosen by the player")
    @PostMapping("/select")
    public ResponseEntity<Void> selectCard (@RequestBody CardPlayDto cardPlayDto) {
        gameSessionService.playPlayerCard(cardPlayDto);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Play random card", description = "Plays a random card on behalf of the player")
    @PostMapping("/randomCard")
    public ResponseEntity<Void> playRandomCard (@RequestBody PlayRandomCardDto playRandomCardDto){
        gameSessionService.playRandomCard(playRandomCardDto);
        return ResponseEntity.noContent().build();
    }
}