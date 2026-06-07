package com.elemental_card_battle.elemental_card_battle.exception.game;

import com.elemental_card_battle.elemental_card_battle.exception.GameException;

public class GameSessionNotFoundException extends GameException {
    public GameSessionNotFoundException(String sessionId) {
        super("Game session not found: " + sessionId);
    }
}