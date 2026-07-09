package com.elemental_card_battle.elemental_card_battle.gamesession;

import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardPlayDto;
import com.elemental_card_battle.elemental_card_battle.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class GameSessionController {

    private final GameSessionService gameSessionService;
    private final UserService userService;

    @MessageMapping("/game/play/{sessionId}")
    public void playCard(
            @DestinationVariable String sessionId,
            @Payload CardPlayDto dto,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        String email = (String) headerAccessor.getSessionAttributes().get("email");

        if (email == null) {
            log.error("No email in WebSocket session!");
            throw new IllegalStateException("User not authenticated!");
        }

        Long userId = userService.getUserProfile(email).id();
        gameSessionService.playPlayerCard(userId, dto.instanceId());
        log.info("Player {} (userId={}) played card {} in game {}", email, userId, dto.instanceId(), sessionId);
    }
}