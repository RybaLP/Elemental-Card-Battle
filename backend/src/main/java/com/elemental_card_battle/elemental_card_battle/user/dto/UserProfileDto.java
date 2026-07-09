package com.elemental_card_battle.elemental_card_battle.user.dto;

public record UserProfileDto(
        Long id,
        String username,
        int currency,
        int gamesWon,
        int gamesLost,
        boolean isBot
) {}