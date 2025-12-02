package com.elemental_card_battle.elemental_card_battle.model;

import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class Room {

    private String id;
    private Player roomOwner;
    private String name;
    private String password;

    private boolean isPrivate;
    private boolean isFull;

    private static final long ROOM_TIMEOUT = 120_000;

    @Builder.Default
    private List<Player> players = new ArrayList<>();

    @Builder.Default
    private List<ChatMessage> messages = new ArrayList<>();

    @Builder.Default
    private long lastActivity = System.currentTimeMillis();


    public void addPlayer (Player player) {
        if (!isFull) {
            players.add(player);
            isFull = players.size() == 2;
        }
    }

    public void removePlayer (Player player) {
        players.remove(player);
        isFull = players.size() == 2;
    }

    public void touch() {
        this.lastActivity = System.currentTimeMillis();
    }

    public boolean isInactive() {
        return System.currentTimeMillis() - lastActivity > ROOM_TIMEOUT;
    }
}