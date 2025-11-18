package com.elemental_card_battle.elemental_card_battle.repository;

import com.elemental_card_battle.elemental_card_battle.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Card, Long> {
}
