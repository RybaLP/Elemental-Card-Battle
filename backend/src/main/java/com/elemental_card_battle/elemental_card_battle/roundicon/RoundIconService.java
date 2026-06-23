package com.elemental_card_battle.elemental_card_battle.roundicon;

import com.elemental_card_battle.elemental_card_battle.card.ElementalType;
import com.elemental_card_battle.elemental_card_battle.exception.card.CardNotFoundException;
import com.elemental_card_battle.elemental_card_battle.model.RoundIcon;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoundIconService {

    private final RoundIconRepository roundIconRepository;

    public String getIconUrlByColorAndType (String color, ElementalType elementalType) {
        return roundIconRepository.findByColorAndElementalType(color, elementalType)
                .map(RoundIcon :: getImageUrl)
                .orElseThrow(CardNotFoundException::new);
    }
}
