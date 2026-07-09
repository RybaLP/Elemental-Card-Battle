package com.elemental_card_battle.elemental_card_battle.exception.gamesession;

public class SessionNotFoundException extends RuntimeException {
    public SessionNotFoundException() {
        super("Game Session not found");
    }
}
