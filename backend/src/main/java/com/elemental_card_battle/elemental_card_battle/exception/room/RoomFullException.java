package com.elemental_card_battle.elemental_card_battle.exception.room;

import com.elemental_card_battle.elemental_card_battle.exception.GameException;

public class RoomFullException extends GameException {
    public RoomFullException() {
        super("Room is full");
    }
}
