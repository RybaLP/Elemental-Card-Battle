package com.elemental_card_battle.elemental_card_battle.dto.room;

import com.elemental_card_battle.elemental_card_battle.gamesession.dto.SessionDto;
import com.elemental_card_battle.elemental_card_battle.model.ChatMessage;

import java.util.List;

public record RoomDto(
        String id,
        String name,
        boolean isPrivate,
        boolean isFull,
        Long roomOwnerId,
        List<SessionDto> players,
        List<ChatMessage> messages
) {}