package com.elemental_card_battle.elemental_card_battle.util;

import com.elemental_card_battle.elemental_card_battle.dto.room.RoomDto;
import com.elemental_card_battle.elemental_card_battle.manager.Lobby;
import com.elemental_card_battle.elemental_card_battle.model.Room;
import com.elemental_card_battle.elemental_card_battle.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class InactiveRoomCleaner {

    private final Lobby lobby;
    private final SimpMessagingTemplate simpMessagingTemplate;


    @Scheduled(fixedRate = 60_000)
    public void cleanInactiveRooms () {

        List<Room> rooms = lobby.getRooms().stream().toList();

        boolean removed = false;

        for (Room room : rooms) {
            if (room.isInactive()) {
                lobby.removeRoom(room.getId());
                removed = true;
            }
        }

        if (removed) {
            simpMessagingTemplate.convertAndSend("/topic/rooms", lobby.getRooms());
        }
    }
}