package com.elemental_card_battle.elemental_card_battle.exception.card;

public class UserAlreadyOwnsCardException extends RuntimeException {
    public UserAlreadyOwnsCardException() {
        super(
                "User already owns provided card"
        );
    }
}
