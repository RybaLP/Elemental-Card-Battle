package com.elemental_card_battle.elemental_card_battle.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatMessage {
    private String message;
    private String senderNickname;
    private String senderId;
}
