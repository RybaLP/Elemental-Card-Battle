package com.elemental_card_battle.elemental_card_battle.dto.room;

import com.elemental_card_battle.elemental_card_battle.gamesession.dto.SessionDto;

import java.util.List;

public record RoomDto(
        String id,
        String name,
        boolean isPrivate,
        boolean isFull,
        Long roomOwnerId,
        List<SessionDto> players
) {}