package com.elemental_card_battle.elemental_card_battle.dto.gamesession;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PlayRandomCardDto {
    private String gameSessionId;
}
