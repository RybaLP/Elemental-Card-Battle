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

    @Builder.Default
    private List<Player> players = new ArrayList<>();

    @Builder.Default
    private List<ChatMessage> messages = new ArrayList<>();

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
}