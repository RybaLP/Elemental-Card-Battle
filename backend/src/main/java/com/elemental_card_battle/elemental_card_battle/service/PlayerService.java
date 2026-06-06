package com.elemental_card_battle.elemental_card_battle.service;

import com.elemental_card_battle.elemental_card_battle.dto.player.PlayerDto;
import com.elemental_card_battle.elemental_card_battle.manager.Lobby;
import com.elemental_card_battle.elemental_card_battle.model.Player;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final Lobby lobby;

    public PlayerDto createPlayer (String playerNickname) {
        String id = UUID.randomUUID().toString();

        Player player = Player.builder()
                .id(id)
                .nickname(playerNickname)
                .isBot(false)
                .build();

        lobby.addPlayer(player);

        return new PlayerDto(player.getId(),playerNickname);
    }
}