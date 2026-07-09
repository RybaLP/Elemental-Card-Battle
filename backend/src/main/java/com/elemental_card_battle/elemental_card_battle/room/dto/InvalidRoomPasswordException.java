package com.elemental_card_battle.elemental_card_battle.room.dto;

public class InvalidRoomPasswordException extends RuntimeException {
    public InvalidRoomPasswordException(String message) {
        super(message);
    }
}
