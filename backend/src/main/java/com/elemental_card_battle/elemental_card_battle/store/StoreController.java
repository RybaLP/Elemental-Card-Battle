package com.elemental_card_battle.elemental_card_battle.store;

import com.elemental_card_battle.elemental_card_battle.card.dto.CardInStoreDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/store")
public class StoreController {

    private final StoreService storeService;

    @GetMapping
    public ResponseEntity<List<CardInStoreDto>> getCurrentStore (@AuthenticationPrincipal UserDetails user) {
        String email = user.getUsername();
        List<CardInStoreDto> offer = storeService.getCurrentStore(email);
        return ResponseEntity.ok(offer);
    }

    @PostMapping("/{cardId}/purchase")
    public ResponseEntity<Void> purchaseCard(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long cardId) {

        String email = user.getUsername();
        storeService.purchaseCard(email, cardId);

        return ResponseEntity.noContent().build();
    }

}