package com.elemental_card_battle.elemental_card_battle.card;

import com.elemental_card_battle.elemental_card_battle.card.dto.OwnedCardDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/inventory")
public class UserCardController {

    private final UserCardService userCardService;

    @GetMapping
    public ResponseEntity<Page<OwnedCardDto>> getOwnedCards (@AuthenticationPrincipal UserDetails userDetails,
                                                             @RequestParam(defaultValue = "0") int page)
    {
        String email = userDetails.getUsername();
        Page<OwnedCardDto> inventory = userCardService.getOwnedCards(email,page);
        return ResponseEntity.ok(inventory);
    }


}