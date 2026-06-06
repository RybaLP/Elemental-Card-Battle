package com.elemental_card_battle.elemental_card_battle.service;

import com.elemental_card_battle.elemental_card_battle.model.Player;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BotService {
    private static final List<String> BOT_NAMES = List.of(
            "ShadowWarrior67",
            "VenomMenon",
            "IronPhantom",
            "DarkSerpent",
            "FrostReaper",
            "BlazeCrusher",
            "StormBringer",
            "NightStalker",
            "CrimsonFang",
            "ThunderWolf",
            "SilentBlade",
            "AshBringer",
            "VoidWalker",
            "RuneBreaker",
            "IceDrifter"
    );

    public Player generateBot () {
        Random random = new Random();
        String botName = BOT_NAMES.get(random.nextInt(BOT_NAMES.size()));

        return Player.builder()
                .id(UUID.randomUUID().toString())
                .nickname(botName)
                .isBot(true)
                .build();
    }

}