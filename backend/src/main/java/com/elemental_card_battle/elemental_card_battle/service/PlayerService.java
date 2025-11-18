package com.elemental_card_battle.elemental_card_battle.service;

import com.elemental_card_battle.elemental_card_battle.dto.player.PlayerDto;
import com.elemental_card_battle.elemental_card_battle.dto.player.PlayerNicknameDto;
import com.elemental_card_battle.elemental_card_battle.manager.Lobby;
import com.elemental_card_battle.elemental_card_battle.model.Player;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final Lobby lobby;

    public PlayerDto createPlayer (PlayerNicknameDto playerNicknameDto) {
        String id = UUID.randomUUID().toString();

        Player player = Player.builder()
                .id(id)
                .nickname(playerNicknameDto.getNickname())
                .build();

        lobby.addPlayer(player);

        return PlayerDto.builder()
                .nickname(player.getNickname())
                .id(player.getId())
                .build();
    }
}