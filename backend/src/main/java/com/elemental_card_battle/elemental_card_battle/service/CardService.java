package com.elemental_card_battle.elemental_card_battle.service;

import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardInstance;
import com.elemental_card_battle.elemental_card_battle.mapper.CardMapper;
import com.elemental_card_battle.elemental_card_battle.model.Card;
import com.elemental_card_battle.elemental_card_battle.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final CardMapper cardMapper;

    public List<CardInstance> generateInitialHand() {
        List<Card> allCards = cardRepository.findAll();
        List<Card> hand = new ArrayList<>();

        for (int i = 0; i < 4; i++) {
            hand.add(allCards.get((int)(Math.random() * allCards.size())));
        }

        return hand.stream()
                .map(card -> {
                    CardInstance cardInstance = cardMapper.cardToCardInstance(card);
                    cardInstance.setInstanceId(UUID.randomUUID().toString());
                    return cardInstance;
                }).collect(Collectors.toList());
    }

    public Card findCardById (Long cardId) {
        return cardRepository.findById(cardId)
                .orElseThrow(() -> new IllegalStateException("Could not find card"));
    }

    public CardInstance generateRandomCard(){
        List<Card> allCards = cardRepository.findAll();
        Card card = allCards.get((int)(Math.random() * allCards.size()));
        CardInstance cardInstance = cardMapper.cardToCardInstance(card);
        cardInstance.setInstanceId(UUID.randomUUID().toString());
        return cardInstance;
    }
}