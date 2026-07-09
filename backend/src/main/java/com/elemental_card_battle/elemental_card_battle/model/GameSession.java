package com.elemental_card_battle.elemental_card_battle.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameSession {

    private String id;
    private PlayerState player1;
    private PlayerState player2;
    private String roomId;

    private Long winnerId;

    @Builder.Default
    private int turnNumber = 0;

    @Builder.Default
    private boolean isOver = false;

    @Builder.Default
    private boolean timerActive = false;

    public PlayerState getPlayerState(Long userId) {
        if (userId == null) return null;
        if (userId.equals(player1.getUserId())) return player1;
        if (userId.equals(player2.getUserId())) return player2;
        throw new IllegalArgumentException("User " + userId + " is not part of this game session.");
    }

    public PlayerState getOpponentState(Long userId) {
        if (userId == null) return null;
        if (userId.equals(player1.getUserId())) return player2;
        if (userId.equals(player2.getUserId())) return player1;
        throw new IllegalArgumentException("User " + userId + " is not part of this game session.");
    }
}