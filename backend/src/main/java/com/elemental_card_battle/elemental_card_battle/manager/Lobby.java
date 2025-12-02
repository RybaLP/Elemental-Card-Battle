package com.elemental_card_battle.elemental_card_battle.manager;

import com.elemental_card_battle.elemental_card_battle.model.Player;
import com.elemental_card_battle.elemental_card_battle.model.Room;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.Collection;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class Lobby {

    private final Map<String, Player> onlinePlayers = new ConcurrentHashMap<>();
    private final Map<String , Room > rooms = new ConcurrentHashMap<>();

    public void addPlayer(Player player) {
        onlinePlayers.put(player.getId(), player);
    }

    public void removePlayer(String playerId) {
        onlinePlayers.remove(playerId);
    }

    public Player getPlayer(String playerId) {
        return onlinePlayers.get(playerId);
    }

    public Collection<Room> getRooms() {
        return rooms.values();
    }

    public Room getRoom(String roomId) {
        return rooms.get(roomId);
    }

    public Room createPublicRoom(String name, Player owner) {

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

    public Room createPrivateRoom (String name ,  Player owner , String password) {
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

    public Room getRoomByPlayerId (String playerId) {

        return rooms.values().stream()
                .filter(room -> room.getPlayers()
                        .stream().anyMatch(p -> p.getId().equals(playerId)))
                .findFirst()
                .orElse(null);
    }

}
