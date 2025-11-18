package com.elemental_card_battle.elemental_card_battle.dto.chatmessage;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatMessageDto {
    private String senderNickname;
    private String senderId;
    private String message;
}
