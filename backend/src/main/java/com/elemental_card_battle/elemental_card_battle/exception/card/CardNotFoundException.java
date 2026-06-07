package com.elemental_card_battle.elemental_card_battle.exception.card;

public class CardNotFoundException extends RuntimeException {
    public CardNotFoundException() {
        super(
                "Could not find elemental card"
        );
    }
}
