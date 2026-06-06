package com.elemental_card_battle.elemental_card_battle.dto.room;

public record JoinRoomDto(
        String playerId,
        String roomId,
        String password
) {}