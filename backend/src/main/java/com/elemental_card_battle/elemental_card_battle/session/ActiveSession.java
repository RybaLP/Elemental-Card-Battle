package com.elemental_card_battle.elemental_card_battle.session;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "userId")
public class ActiveSession {
    private Long userId;
    private String email;
    private String nickname;
    private String simpSessionId;
    private SessionStatus status;
    private String currentRoomId;
}