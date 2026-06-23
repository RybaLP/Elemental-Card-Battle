package com.elemental_card_battle.elemental_card_battle.store;

import com.elemental_card_battle.elemental_card_battle.card.CardService;
import com.elemental_card_battle.elemental_card_battle.card.UserCardService;
import com.elemental_card_battle.elemental_card_battle.card.dto.CardInStoreDto;
import com.elemental_card_battle.elemental_card_battle.card.model.Card;
import com.elemental_card_battle.elemental_card_battle.card.model.UserCard;
import com.elemental_card_battle.elemental_card_battle.exception.card.UserAlreadyOwnsCardException;
import com.elemental_card_battle.elemental_card_battle.user.User;
import com.elemental_card_battle.elemental_card_battle.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoreService {

    private final CardService cardService;
    private final UserService userService;
    private final UserCardService userCardService;

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

    @Transactional
    public void purchaseCard (String email, Long cardId) {
        User user = userService.findUserByEmail(email);
        Card card = cardService.findCardById(cardId);
        if (userCardService.doesUserOwnCard(user, card)) {
            throw new UserAlreadyOwnsCardException();
        }
        userService.validateFunds(user,card.getPrice());
        userService.deductBalance(user,card.getPrice());
        UserCard userCard = new UserCard(user,card);
        userCardService.saveUserCard(userCard);
        log.info("User {} purchased card {}", email, card.getName());
    }

}
