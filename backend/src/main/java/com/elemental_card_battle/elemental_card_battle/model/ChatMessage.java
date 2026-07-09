package com.elemental_card_battle.elemental_card_battle.model;

public record ChatMessage(
        String senderNickname,
        Long senderId,
        String message,
        long timeStamp
) {}