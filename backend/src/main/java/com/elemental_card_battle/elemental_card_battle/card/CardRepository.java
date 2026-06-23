package com.elemental_card_battle.elemental_card_battle.card;

import com.elemental_card_battle.elemental_card_battle.card.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {

    @Query("SELECT c FROM Card c WHERE c.price = 0")
    List<Card> getFreeCards();

    @Query("SELECT c FROM Card c WHERE c.price > 0")
    List<Card> getPaidCards();
}
