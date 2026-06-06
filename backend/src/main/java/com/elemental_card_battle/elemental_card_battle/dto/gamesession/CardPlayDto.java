package com.elemental_card_battle.elemental_card_battle.dto.gamesession;

public record CardPlayDto(
        String sessionId,
        String playerId,
        String instanceId
) {}
