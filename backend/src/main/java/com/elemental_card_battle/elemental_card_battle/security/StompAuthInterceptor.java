package com.elemental_card_battle.elemental_card_battle.security;

import com.elemental_card_battle.elemental_card_battle.session.ActiveSession;
import com.elemental_card_battle.elemental_card_battle.session.ActiveSessionManager;
import com.elemental_card_battle.elemental_card_battle.session.SessionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class StompAuthInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private final ActiveSessionManager activeSessionManager;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor
                .getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) return message;

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new MessageDeliveryException("Missing JWT token");
            }

            String token = authHeader.substring(7);
            Long userId = jwtService.extractUserId(token);
            String nickname = jwtService.extractClaim(token, claims -> claims.get("username", String.class));
            String simpSessionId = accessor.getSessionId();
            String email = jwtService.extractUsername(token);

            accessor.getSessionAttributes().put("email", email);

            ActiveSession session = ActiveSession.builder()
                    .userId(userId)
                    .email(email)
                    .nickname(nickname)
                    .simpSessionId(simpSessionId)
                    .status(SessionStatus.ONLINE)
                    .currentRoomId(null)
                    .currentGameSessionId(null)
                    .build();

            log.info("STOMP CONNECT - creating session for userId: {}, email: {} nickname {}", userId, email, nickname);
            activeSessionManager.registerSessions(session);
        }

        if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
            String simpSessionId = accessor.getSessionId();
            log.info("STOMP DISCONNECT - cleaning up session: {}", simpSessionId);

            activeSessionManager.removeSessionBySimpSessionId(simpSessionId);
        }

        return message;
    }
}