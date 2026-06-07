package com.elemental_card_battle.elemental_card_battle.exception.room;

import com.elemental_card_battle.elemental_card_battle.exception.GameException;

public class RoomNotFoundException extends GameException {
    public RoomNotFoundException(String roomId) {
        super("Room not found: " + roomId);
    }
}
