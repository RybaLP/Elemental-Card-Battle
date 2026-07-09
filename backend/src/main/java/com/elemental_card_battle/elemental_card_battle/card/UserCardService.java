package com.elemental_card_battle.elemental_card_battle.card;

import com.elemental_card_battle.elemental_card_battle.card.dto.OwnedCardDto;
import com.elemental_card_battle.elemental_card_battle.card.model.Card;
import com.elemental_card_battle.elemental_card_battle.card.model.UserCard;
import com.elemental_card_battle.elemental_card_battle.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    public List<Card> getOwnedCards (String username){
        return userCardRepository.findCardsByEmail(username);
    }

    public List<Card> getOwnedCardsByUserId(Long userId) {
        return userCardRepository.findCardsByUserId(userId);
    }

    @Transactional
    public void saveUserCard(UserCard userCard) {
        userCardRepository.save(userCard);
    }

    public Page<OwnedCardDto> getOwnedCards (String email, int page) {
        Pageable pageable = PageRequest.of(page, 6, Sort.by("acquiredAt").descending());
        Page<UserCard> userCards = userCardRepository.findByUserEmail(email, pageable);
        return userCards.map(this::convertToDto);
    }

    private OwnedCardDto convertToDto(UserCard uc) {
        return new OwnedCardDto(
                uc.getCard().getId(),
                uc.getCard().getName(),
                uc.getCard().getImageUrl(),
                uc.getAcquiredAt()
        );
    }
}