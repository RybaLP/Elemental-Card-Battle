package com.elemental_card_battle.elemental_card_battle.dto.room;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JoinRoomDto {
    private String playerId;
    private String roomId;
    private String password;
}