package com.elemental_card_battle.elemental_card_battle.exception.user;

public class UserHasNotEnoughBalance extends RuntimeException {
    public UserHasNotEnoughBalance() {
        super(
                "User has not enough balance to purchase card"
        );
    }
}
