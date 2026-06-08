package com.elemental_card_battle.elemental_card_battle.exception.player;

import com.elemental_card_battle.elemental_card_battle.exception.GameException;

public class InvalidPlayerNicknameException extends GameException {
    public InvalidPlayerNicknameException() {
        super("Player nickname cannot be empty");
    }
}