package com.elemental_card_battle.elemental_card_battle.card.dto;

import java.time.LocalDateTime;

public record OwnedCardDto(
        Long id,
        String name,
        String imageUrl,
        LocalDateTime acquiredAt
) {}