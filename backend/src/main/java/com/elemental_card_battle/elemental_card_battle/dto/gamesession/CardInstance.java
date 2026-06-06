package com.elemental_card_battle.elemental_card_battle.dto.gamesession;

public record CardInstance(
        String instanceId,
        Long id,
        int power,
        String name,
        String color,
        String elementalType,
        String imageUrl
) {}