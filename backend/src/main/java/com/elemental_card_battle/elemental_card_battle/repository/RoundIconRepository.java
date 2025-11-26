package com.elemental_card_battle.elemental_card_battle.repository;

import com.elemental_card_battle.elemental_card_battle.model.RoundIcon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoundIconRepository extends JpaRepository<RoundIcon, Long> {
    Optional<RoundIcon> findByColorAndElementalType(String color, String elementalType);
}