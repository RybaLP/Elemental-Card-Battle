package com.elemental_card_battle.elemental_card_battle.chatmessage;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatMessage {
    private String message;
    private String senderNickname;
    private String senderId;
}
