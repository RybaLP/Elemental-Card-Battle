package com.elemental_card_battle.elemental_card_battle.exception.user;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String username) {
        super("Could not find user with provided username: " + username);
    }
}