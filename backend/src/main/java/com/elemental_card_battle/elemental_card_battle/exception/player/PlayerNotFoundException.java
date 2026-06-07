package com.elemental_card_battle.elemental_card_battle.exception.player;

import com.elemental_card_battle.elemental_card_battle.exception.GameException;

public class PlayerNotFoundException extends GameException {
    public PlayerNotFoundException(String playerId) {
        super(
                "Player not found: " + playerId
        );
    }
}
