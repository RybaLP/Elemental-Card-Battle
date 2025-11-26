package com.elemental_card_battle.elemental_card_battle.service;

import com.elemental_card_battle.elemental_card_battle.model.Card;
import com.elemental_card_battle.elemental_card_battle.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;

    public List<Card> generateInitialHand() {
        List<Card> allCards = cardRepository.findAll();
        List<Card> hand = new ArrayList<>();

        for (int i = 0; i < 4; i++) {
            hand.add(allCards.get((int)(Math.random() * allCards.size())));
        }

        return hand;
    }

    public Card findCardById (Long cardId) {
        return cardRepository.findById(cardId)
                .orElseThrow(() -> new IllegalStateException("Could not find card"));
    }

    public Card generateRandomCard() {
        List<Card> allCards = cardRepository.findAll();
        return allCards.get((int)(Math.random() * allCards.size()));
    }
}