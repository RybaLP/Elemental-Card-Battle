package com.elemental_card_battle.elemental_card_battle.dto.gamesession;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CardInstance {
    private String instanceId;
    private Long id;
    private int power;
    private String name;
    private String color;
    private String elementalType;
    private String imageUrl;
}
