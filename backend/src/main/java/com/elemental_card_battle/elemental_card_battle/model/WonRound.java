package com.elemental_card_battle.elemental_card_battle.model;

import com.elemental_card_battle.elemental_card_battle.card.ElementalType;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WonRound {
//    color of card which won the round
    private String color;

//    elemental card type which won the round
    private ElementalType elementalType;
    private String imageUrl;
}