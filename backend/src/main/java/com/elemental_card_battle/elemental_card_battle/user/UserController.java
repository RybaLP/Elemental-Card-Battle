package com.elemental_card_battle.elemental_card_battle.user;

import com.elemental_card_battle.elemental_card_battle.user.dto.UserProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<UserProfileDto> getUserProfileByUsername (
            @PathVariable String username
    ){
        return ResponseEntity.ok(userService.getUserProfileByUsername(username));
    }

    @GetMapping
    public ResponseEntity<UserProfileDto> getUserProfile (@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        return ResponseEntity.ok(userService.getUserProfile(email));
    }


}
