package com.elemental_card_battle.elemental_card_battle.manager;

import com.elemental_card_battle.elemental_card_battle.model.Room;
import com.elemental_card_battle.elemental_card_battle.session.ActiveSession;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class Lobby {

    private final Map<String, Room> rooms = new ConcurrentHashMap<>();

    public Collection<Room> getRooms() {
        return rooms.values();
    }

    public Room getRoom(String roomId) {
        return rooms.get(roomId);
    }

    public Room createPublicRoom(String name, ActiveSession owner) {
        Room room = Room.builder()
                .roomOwner(owner)
                .name(name)
                .id(UUID.randomUUID().toString())
                .isPrivate(false)
                .build();
        room.addPlayer(owner);
        rooms.put(room.getId(), room);
        return room;
    }

    public Room createPrivateRoom(String name, ActiveSession owner, String password) {
        Room room = Room.builder()
                .roomOwner(owner)
                .password(password)
                .name(name)
                .isPrivate(true)
                .id(UUID.randomUUID().toString())
                .build();
        room.addPlayer(owner);
        rooms.put(room.getId(), room);
        return room;
    }

    public void removeRoom(String roomId) {
        rooms.remove(roomId);
    }

    public Room getRoomByUserId(Long userId) {
        return rooms.values().stream()
                .filter(room -> room.getPlayers().stream()
                        .anyMatch(s -> s.getUserId() != null && s.getUserId().equals(userId)))
                .findFirst()
                .orElse(null);
    }
}