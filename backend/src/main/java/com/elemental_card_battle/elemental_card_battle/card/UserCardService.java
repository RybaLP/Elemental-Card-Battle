package com.elemental_card_battle.elemental_card_battle.card;

import com.elemental_card_battle.elemental_card_battle.card.model.Card;
import com.elemental_card_battle.elemental_card_battle.card.model.UserCard;
import com.elemental_card_battle.elemental_card_battle.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserCardService {

    private final UserCardRepository userCardRepository;

    public boolean doesUserOwnCard (User user, Card card) {
        boolean owns = userCardRepository.existsByUserAndCard(user,card);
        log.debug("Checking ownership for User ID: {} and Card ID: {}. Result: {}",
                user.getId(), card.getId(), owns);

        return owns;
    }

    @Transactional
    public void saveUserCard(UserCard userCard) {
        userCardRepository.save(userCard);
    }

}