package com.elemental_card_battle.elemental_card_battle.dto.gamesession;

import com.elemental_card_battle.elemental_card_battle.model.WonRound;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RoundResultDto {
    private String winnerId;

    private String p1Id;
    private String p2Id;

    private List<WonRound> p1WonRounds;
    private List<WonRound> p2WonRounds;

    private CardInstance p1Card;
    private CardInstance p2Card;

    private List<CardInstance> p1Cards;
    private List<CardInstance> p2Cards;
}
