package com.elemental_card_battle.elemental_card_battle.card;

import com.elemental_card_battle.elemental_card_battle.card.model.Card;
import com.elemental_card_battle.elemental_card_battle.card.model.UserCard;
import com.elemental_card_battle.elemental_card_battle.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserCardRepository extends JpaRepository<UserCard, Long> {

    @Query("SELECT uc.card FROM UserCard uc WHERE uc.user.email = :email")
    List<Card> findCardsByEmail(String email);

    boolean existsByUserAndCard(User user, Card card);
}
