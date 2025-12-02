package com.elemental_card_battle.elemental_card_battle.listener;

import com.elemental_card_battle.elemental_card_battle.manager.Lobby;
import com.elemental_card_battle.elemental_card_battle.model.Room;
import com.elemental_card_battle.elemental_card_battle.util.GameSessionBroadcaster;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {
    private final Lobby lobby;
    private final GameSessionBroadcaster gameSessionBroadcaster;

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent disconnectEvent) {

    }
}
