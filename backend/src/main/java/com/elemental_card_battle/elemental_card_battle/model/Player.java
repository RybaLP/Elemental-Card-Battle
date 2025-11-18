package com.elemental_card_battle.elemental_card_battle.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class Player {
    private String id;
    private String nickname;
}