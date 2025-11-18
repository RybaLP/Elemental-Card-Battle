package com.elemental_card_battle.elemental_card_battle.dto.player;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlayerDto {
    private String id;
    private String nickname;
}
