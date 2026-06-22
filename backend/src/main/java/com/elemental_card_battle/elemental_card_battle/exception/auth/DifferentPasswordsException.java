package com.elemental_card_battle.elemental_card_battle.exception.auth;

public class DifferentPasswordsException extends RuntimeException {
    public DifferentPasswordsException( ) {
        super(
                "Passwords are not equal"
        );
    }
}
