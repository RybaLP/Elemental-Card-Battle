package com.elemental_card_battle.elemental_card_battle.user.dto;

public record LeaderBoardEntryDto(
        String username,
        int gamesWon,
        int gamesLost,
        double winRate
) {
}
