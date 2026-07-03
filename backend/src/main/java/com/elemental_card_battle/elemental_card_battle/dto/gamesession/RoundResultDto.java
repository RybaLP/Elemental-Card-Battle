package com.elemental_card_battle.elemental_card_battle.dto.gamesession;

import com.elemental_card_battle.elemental_card_battle.model.WonRound;

import java.util.List;

public record RoundResultDto(
        Long winnerId,
        Long p1Id,
        Long p2Id,
        List<WonRound> p1WonRounds,
        List<WonRound> p2WonRounds,
        CardInstance p1Card,
        CardInstance p2Card,
        List<CardInstance> p1Cards,
        List<CardInstance> p2Cards
) {}