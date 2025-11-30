package com.elemental_card_battle.elemental_card_battle.controler;

import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardPlayDto;
import com.elemental_card_battle.elemental_card_battle.dto.gamesession.PlayRandomCardDto;
import com.elemental_card_battle.elemental_card_battle.manager.GameSessionManager;
import com.elemental_card_battle.elemental_card_battle.model.GameSession;
import com.elemental_card_battle.elemental_card_battle.service.GameSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/game")
@RestController
@RequiredArgsConstructor
public class GameSessionController {

    private final GameSessionService gameSessionService;
    private final GameSessionManager gameSessionManager;

    @PostMapping("/start/{roomId}")
    public ResponseEntity<GameSession> startGame (@PathVariable String roomId) {
        GameSession gameSession = gameSessionManager.createSession(roomId);
        return ResponseEntity.ok(gameSession);
    }

    @PostMapping("/select")
    public ResponseEntity<Void> selectCard (@RequestBody CardPlayDto cardPlayDto) {
        gameSessionService.playPlayerCard(cardPlayDto);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/randomCard")
    public ResponseEntity<Void> playRandomCard (@RequestBody PlayRandomCardDto playRandomCardDto){
        gameSessionService.playRandomCard(playRandomCardDto.getGameSessionId());
        return ResponseEntity.noContent().build();
    }
}