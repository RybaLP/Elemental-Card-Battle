package com.elemental_card_battle.elemental_card_battle.card.dto;

public record CardInStoreDto(
        Long id,
        String name,
        String imageUrl,
        int power,
        int price
) {}