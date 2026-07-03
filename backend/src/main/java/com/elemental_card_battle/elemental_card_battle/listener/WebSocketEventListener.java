package com.elemental_card_battle.elemental_card_battle.listener;

import com.elemental_card_battle.elemental_card_battle.session.ActiveSession;
import com.elemental_card_battle.elemental_card_battle.session.ActiveSessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final ActiveSessionManager activeSessionManager;

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String simpSessionId = accessor.getSessionId();

        ActiveSession session = activeSessionManager.getSessionBySimpId(simpSessionId);
        if (session != null) {
            activeSessionManager.removeSession(session.getUserId());
        }
    }
}
