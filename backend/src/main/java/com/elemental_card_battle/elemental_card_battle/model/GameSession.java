package com.elemental_card_battle.elemental_card_battle.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GameSession {

    private String id;
    private PlayerState player1;
    private PlayerState player2;
    private String roomId;

    private String winnerId;

    private int turnNumber;
    private boolean isOver;

    private boolean timerActive;
}
