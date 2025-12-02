package com.elemental_card_battle.elemental_card_battle.service;

import com.elemental_card_battle.elemental_card_battle.dto.chatmessage.ChatMessageDto;
import com.elemental_card_battle.elemental_card_battle.dto.chatmessage.ChatMessageReqDto;
import com.elemental_card_battle.elemental_card_battle.manager.Lobby;
import com.elemental_card_battle.elemental_card_battle.model.ChatMessage;
import com.elemental_card_battle.elemental_card_battle.model.Room;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final Lobby lobby;

    public ChatMessageDto createMessage (ChatMessageReqDto chatMessageReqDto) {
        Room room = lobby.getRoom(chatMessageReqDto.getRoomId());
        if (room == null) {
            throw new IllegalStateException("Room does not exist");
        }

        ChatMessage chatMessage = ChatMessage.builder()
                .message(chatMessageReqDto.getMessage())
                .senderNickname(chatMessageReqDto.getSenderNickname())
                .senderId(chatMessageReqDto.getSenderId())
                .build();

        room.getMessages().add(chatMessage);

        ChatMessageDto dto = ChatMessageDto.builder()
                .message(chatMessageReqDto.getMessage())
                .senderNickname(chatMessageReqDto.getSenderNickname())
                .senderId(chatMessageReqDto.getSenderId())
                .build();

        room.touch();

        simpMessagingTemplate.convertAndSend("/topic/room/" + chatMessageReqDto.getRoomId() + "/messages", dto);

        return dto;
    }
}