package com.elemental_card_battle.elemental_card_battle.dto.gamesession;

import com.elemental_card_battle.elemental_card_battle.card.ElementalType;

public record CardInstance(
        String instanceId,
        Long id,
        int power,
        String name,
        String color,
        ElementalType elementalType,
        String imageUrl
) {}