package com.elemental_card_battle.elemental_card_battle.user.dto;

import com.elemental_card_battle.elemental_card_battle.card.dto.OwnedCardDto;

import java.util.List;

public record ProfileDto(
        String username,
        int gamesWon,
        int gamesLost,
        int currency,
        List<OwnedCardDto> ownedCards
) {}