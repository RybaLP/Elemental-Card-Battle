package com.elemental_card_battle.elemental_card_battle.user.dto;

public record RoomPlayerDto(
        Long id,
        String username,
        boolean isBot
) {}