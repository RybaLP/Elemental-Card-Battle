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
    private String currentGameSessionId;

    public boolean isInGame() {
        return status == SessionStatus.IN_GAME && currentGameSessionId != null;
    }

    public boolean isInRoom () {
        return status == SessionStatus.IN_ROOM && currentRoomId != null;
    }

    public void clearGameSession () {
        this.currentGameSessionId = null;
        this.status = SessionStatus.ONLINE;
    }

    public void clearRoom() {
        this.currentRoomId = null;
        if (status == SessionStatus.IN_ROOM) {
            this.status = SessionStatus.ONLINE;
        }
    }

}