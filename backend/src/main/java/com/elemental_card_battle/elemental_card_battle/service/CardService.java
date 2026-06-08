package com.elemental_card_battle.elemental_card_battle.service;

import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardInstance;
import com.elemental_card_battle.elemental_card_battle.model.Card;
import com.elemental_card_battle.elemental_card_battle.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;

    public List<CardInstance> generateInitialHand() {
        List<Card> allCards = cardRepository.findAll();
        Random random = new Random();

        return IntStream.range(0, 4)
                .mapToObj(i -> allCards.get(random.nextInt(allCards.size())))
                .map(card -> new CardInstance(
                        UUID.randomUUID().toString(),
                        card.getId(),
                        card.getPower(),
                        card.getName(),
                        card.getColor(),
                        card.getElementalType(),
                        card.getImageUrl()
                )).collect(Collectors.toList());
    }

    public CardInstance generateRandomCard() {
        List<Card> allCards = cardRepository.findAll();
        Card card = allCards.get((int)(Math.random() * allCards.size()));

        return new CardInstance(
                UUID.randomUUID().toString(),
                card.getId(),
                card.getPower(),
                card.getName(),
                card.getColor(),
                card.getElementalType(),
                card.getImageUrl()
        );
    }
}