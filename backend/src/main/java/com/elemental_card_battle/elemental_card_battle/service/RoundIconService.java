package com.elemental_card_battle.elemental_card_battle.service;

import com.elemental_card_battle.elemental_card_battle.model.RoundIcon;
import com.elemental_card_battle.elemental_card_battle.repository.RoundIconRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoundIconService {

    private final RoundIconRepository roundIconRepository;

    public String getIconUrlByColorAndType (String color, String elementalType) {
        return roundIconRepository.findByColorAndElementalType(color, elementalType)
                .map(RoundIcon :: getImageUrl)
                .orElse(null);
    }
}
