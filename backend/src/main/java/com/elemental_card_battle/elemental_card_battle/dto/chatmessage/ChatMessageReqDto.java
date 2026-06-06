package com.elemental_card_battle.elemental_card_battle.dto.chatmessage;

public record ChatMessageReqDto(
        String senderNickname,
        String message,
        String roomId,
        String senderId
){}