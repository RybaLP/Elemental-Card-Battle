package com.elemental_card_battle.elemental_card_battle.dto.room;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreatePublicRoomDto {
    private String name;
    private String playerId;
}
