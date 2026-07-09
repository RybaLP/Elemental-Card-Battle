package com.elemental_card_battle.elemental_card_battle.model;

import com.elemental_card_battle.elemental_card_battle.session.ActiveSession;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Room {

    private String id;
    private ActiveSession roomOwner;
    private String name;
    private String password;
    private boolean isPrivate;
    private boolean isFull;

    @Builder.Default
    private boolean isGameStarted = false;

    private static final long ROOM_TIMEOUT = 120_000;

    @Builder.Default
    private List<ActiveSession> players = new ArrayList<>();

    @Builder.Default
    private List<ChatMessage> messages = new ArrayList<>();

    @Builder.Default
    private long lastActivity = System.currentTimeMillis();

    public void addPlayer(ActiveSession session) {
        if (!isFull) {
            players.add(session);
            isFull = players.size() == 2;
        }
    }

    public void removePlayer(ActiveSession session) {
        players.remove(session);
        isFull = players.size() >= 2;
    }

    public void touch() {
        this.lastActivity = System.currentTimeMillis();
    }

    public boolean isInactive() {
        return System.currentTimeMillis() - lastActivity > ROOM_TIMEOUT;
    }
}