package com.elemental_card_battle.elemental_card_battle.dto.room;

import com.elemental_card_battle.elemental_card_battle.dto.player.PlayerDto;
import java.util.List;

public record RoomDto(String id, String name, boolean isPrivate, boolean isFull, String roomOwnerId, List<PlayerDto>players) {}

