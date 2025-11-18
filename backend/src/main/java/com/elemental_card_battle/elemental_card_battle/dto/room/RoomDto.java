package com.elemental_card_battle.elemental_card_battle.dto.room;

import com.elemental_card_battle.elemental_card_battle.dto.player.PlayerDto;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RoomDto {
    private String id;
    private String name ;
    private boolean isPrivate;
    private boolean isFull;
    private String roomOwnerId;
    private List<PlayerDto> players;
}