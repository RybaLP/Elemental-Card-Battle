package com.elemental_card_battle.elemental_card_battle.dto.chatmessage;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatMessageReqDto {
    private String senderNickname;
    private String message;
    private String roomId;
    private String senderId;
}
