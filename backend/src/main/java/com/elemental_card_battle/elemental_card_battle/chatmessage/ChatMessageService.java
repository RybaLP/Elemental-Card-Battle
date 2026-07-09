package com.elemental_card_battle.elemental_card_battle.chatmessage;

import com.elemental_card_battle.elemental_card_battle.chatmessage.dto.ChatMessageDto;
import com.elemental_card_battle.elemental_card_battle.manager.Lobby;
import com.elemental_card_battle.elemental_card_battle.model.ChatMessage;
import com.elemental_card_battle.elemental_card_battle.model.Room;
import com.elemental_card_battle.elemental_card_battle.room.RoomService;
import com.elemental_card_battle.elemental_card_battle.user.User;
import com.elemental_card_battle.elemental_card_battle.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatMessageService {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final Lobby lobby;
    private final UserService userService;
    private final RoomService roomService;

    @MessageMapping("/chat/send")
    public void handleChatMessage (String message, String email) {
        try {
            User user = userService.findUserByEmail(email);
            Room room = roomService.findRoomByUserId(user.getId());

            if (room == null) {
                log.warn("User {} tried to send message but is not in any room", email);
                return;
            }

            if (message== null || message.isBlank()) {
                log.warn("User {} tried to send empty message", email);
                return;
            }

            String trimmedMessage = message.trim();

            ChatMessage chatMessage = new ChatMessage(
                    user.getUsername(),
                    user.getId(),
                    trimmedMessage,
                    System.currentTimeMillis()
            );

            room.getMessages().add(chatMessage);

            ChatMessageDto chatMessageDto1 = new ChatMessageDto(
                    user.getUsername(),
                    user.getId(),
                    trimmedMessage,
                    chatMessage.timeStamp(),
                    room.getId()
            );

            simpMessagingTemplate.convertAndSend(
                    "/topic/room/" + room.getId() + "/chat",
                    chatMessageDto1
            );

            log.info("User {} sent message in room {}",email, room.getId());;
        } catch (Exception e) {
            log.error("error processing chat message from {}: {}", email, e.getMessage());
        }
    }
}