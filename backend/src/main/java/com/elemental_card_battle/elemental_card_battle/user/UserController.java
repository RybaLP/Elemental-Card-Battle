package com.elemental_card_battle.elemental_card_battle.user;

import com.elemental_card_battle.elemental_card_battle.user.dto.LeaderBoardEntryDto;
import com.elemental_card_battle.elemental_card_battle.user.dto.ProfileDto;
import com.elemental_card_battle.elemental_card_battle.user.dto.UserProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/profile")
    public ResponseEntity<ProfileDto> getProfile (@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        return ResponseEntity.ok(userService.getProfileByEmail(email));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderBoardEntryDto>> getTopPlayers(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(userService.getTopPlayers(limit));
    }

}
