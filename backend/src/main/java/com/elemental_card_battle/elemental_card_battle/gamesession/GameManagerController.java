package com.elemental_card_battle.elemental_card_battle.gamesession;

import com.elemental_card_battle.elemental_card_battle.model.GameSession;
import com.elemental_card_battle.elemental_card_battle.room.dto.RoomIdDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/game-session")
@Slf4j
@RequiredArgsConstructor
public class GameManagerController {

    private final GameSessionManager gameSessionManager;

    @PostMapping("/start")
    public ResponseEntity<GameSession> startGame(@RequestBody RoomIdDto roomIdDto,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        GameSession gameSession = gameSessionManager.startGame(roomIdDto.roomId(), email);
        log.info("Game started, returning session id: {}", gameSession.getId());
        return ResponseEntity.ok(gameSession);
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<GameSession> getGameSession(@PathVariable String sessionId) {
        GameSession session = gameSessionManager.getSessionById(sessionId);
        if (session == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(session);
    }
}