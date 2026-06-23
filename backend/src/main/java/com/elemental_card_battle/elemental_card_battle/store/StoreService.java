package com.elemental_card_battle.elemental_card_battle.store;

import com.elemental_card_battle.elemental_card_battle.card.CardService;
import com.elemental_card_battle.elemental_card_battle.card.dto.CardInStoreDto;
import com.elemental_card_battle.elemental_card_battle.card.model.Card;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final CardService cardService;

    @Transactional(readOnly = true)
    public List<CardInStoreDto> getCurrentStore (String email) {
        List<Long> ownedCardIds = cardService.getOwnedCards(email).stream()
                .map(Card::getId)
                .toList();

        return cardService.getCardsToBuy().stream()
                .filter(c -> !ownedCardIds.contains(c.getId()))
                .map(c -> new CardInStoreDto(c.getId(),c.getName(),c.getImageUrl(),c.getPower(),c.getPrice()))
                .toList();
    }

}
