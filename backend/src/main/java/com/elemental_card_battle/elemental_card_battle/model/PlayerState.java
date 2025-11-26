package com.elemental_card_battle.elemental_card_battle.model;

import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class PlayerState {

    String playerId;

    @Builder.Default
    private List<Card> currentHand = new ArrayList<>();

    @Builder.Default
    private List<Card> wonCards = new ArrayList<>();

    @Builder.Default
    private List<WonRound> wonRounds = new ArrayList<>();

    @Builder.Default
    private boolean hasPlayedThisTurn = false;

    private Card selectedCard;
}
