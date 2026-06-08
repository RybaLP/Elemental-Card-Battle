package com.elemental_card_battle.elemental_card_battle.exception.room;

import com.elemental_card_battle.elemental_card_battle.exception.GameException;

public class NotRoomOwnerException extends GameException {
    public NotRoomOwnerException( ) {
        super(
                "Only room owner can perform  this action"
        );
    }
}
