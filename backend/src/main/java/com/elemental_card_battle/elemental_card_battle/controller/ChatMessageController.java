package com.elemental_card_battle.elemental_card_battle.controler;

import com.elemental_card_battle.elemental_card_battle.dto.chatmessage.ChatMessageDto;
import com.elemental_card_battle.elemental_card_battle.dto.chatmessage.ChatMessageReqDto;
import com.elemental_card_battle.elemental_card_battle.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("chat-message")
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    @PostMapping
    public ResponseEntity<ChatMessageDto> sendChatMessage (@RequestBody ChatMessageReqDto chatMessageReqDto) {
        ChatMessageDto chatMessageDto1 = chatMessageService.createMessage(chatMessageReqDto);
        return ResponseEntity.ok(chatMessageDto1);
    }

}
