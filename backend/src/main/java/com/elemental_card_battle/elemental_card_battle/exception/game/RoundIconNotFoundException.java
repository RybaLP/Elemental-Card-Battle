package com.elemental_card_battle.elemental_card_battle.exception.game;

import com.elemental_card_battle.elemental_card_battle.exception.GameException;

public class RoundIconNotFoundException extends GameException {
    public RoundIconNotFoundException(String color, String elementalType) {
        super("Round icon not found for color: " + color + " and type: " + elementalType);
    }
}