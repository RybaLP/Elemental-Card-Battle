package com.elemental_card_battle.elemental_card_battle.card;

import com.elemental_card_battle.elemental_card_battle.dto.gamesession.CardInstance;
import com.elemental_card_battle.elemental_card_battle.card.model.Card;
import com.elemental_card_battle.elemental_card_battle.exception.card.CardNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final UserCardService userCardService;

    private final AtomicInteger instanceIdCounter = new AtomicInteger(1);

    public Card findCardById (Long id) {
        return cardRepository.findById(id)
                .orElseThrow(CardNotFoundException::new);
    }

    public List<Card> getStarterDeck() {
        return cardRepository.getFreeCards();
    }

    public List<Card> getCardsToBuy () {
        return cardRepository.getPaidCards();
    }

    public List<Card> getOwnedCards (String username){
        return userCardService.getOwnedCards(username);
    }

    public List<CardInstance> generateInitialHand(Long userId) {
        List<Card> cards = userId < 0
                ? cardRepository.findAll()
                : userCardService.getOwnedCardsByUserId(userId);

        if (cards.isEmpty()) throw new IllegalStateException("No cards available for userId: " + userId);

        Random random = new Random();
        return IntStream.range(0, 4)
                .mapToObj(i -> cards.get(random.nextInt(cards.size())))
                .map(card -> new CardInstance(
                        instanceIdCounter.getAndIncrement(),
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
                instanceIdCounter.getAndIncrement(),
                card.getId(),
                card.getPower(),
                card.getName(),
                card.getColor(),
                card.getElementalType(),
                card.getImageUrl()
        );
    }
}