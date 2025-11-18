package com.elemental_card_battle.elemental_card_battle.controler;

import com.elemental_card_battle.elemental_card_battle.dto.player.PlayerDto;
import com.elemental_card_battle.elemental_card_battle.dto.player.PlayerNicknameDto;
import com.elemental_card_battle.elemental_card_battle.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/players")
public class PlayerController {
    private final PlayerService playerService;

    @PostMapping
    public ResponseEntity<PlayerDto> createPlayer (@RequestBody PlayerNicknameDto playerNicknameDto) {
        PlayerDto player = playerService.createPlayer(playerNicknameDto);
        return ResponseEntity.ok(player);
    }
}
