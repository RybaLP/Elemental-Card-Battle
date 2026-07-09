package com.elemental_card_battle.elemental_card_battle.chatmessage.dto;

public record ChatMessageDto(
        String senderNickname,
        Long senderId,
        String message,
        long timeStamp,
        String roomId
) {}