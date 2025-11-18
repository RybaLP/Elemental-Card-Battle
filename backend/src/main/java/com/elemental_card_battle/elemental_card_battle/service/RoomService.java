package com.elemental_card_battle.elemental_card_battle.service;

import com.elemental_card_battle.elemental_card_battle.dto.room.*;
import com.elemental_card_battle.elemental_card_battle.manager.Lobby;
import com.elemental_card_battle.elemental_card_battle.mapper.RoomMapper;
import com.elemental_card_battle.elemental_card_battle.model.Player;
import com.elemental_card_battle.elemental_card_battle.model.Room;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final Lobby lobby;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final RoomMapper roomMapper;

    private void broadcastRooms () {
        simpMessagingTemplate.convertAndSend(
                "/topic/rooms",
                lobby.getRooms()
        );
    }

    private void broadcastRoom (String roomId) {
        Room room = lobby.getRoom(roomId);
        if (room != null) {
            simpMessagingTemplate.convertAndSend(
                    "/topic/room/" + roomId,
                    roomMapper.roomToRoomDto(room)
            );
        }
    }


    public List<RoomDto> findAllRooms () {
        List<Room> rooms = lobby.getRooms().stream().toList();
        return rooms.stream().map(roomMapper :: roomToRoomDto).toList();
    }

    public RoomDto getRoomById (String roomId) {
        Room room = lobby.getRoom(roomId);
        if (room == null) {
            throw new IllegalStateException("Room does not exist");
        }
        return roomMapper.roomToRoomDto(room);
    }

    public RoomDto createPublicRoom (CreatePublicRoomDto createPublicRoomDto) {

        String playerId = createPublicRoomDto.getPlayerId();
        String name = createPublicRoomDto.getName();

        Player roomOwner = lobby.getPlayer(playerId);
        if (roomOwner == null) throw new RuntimeException("Player not found");
        Room room = lobby.createPublicRoom(name, roomOwner);

        broadcastRooms();

        return roomMapper.roomToRoomDto(room);
    }

    public RoomDto createPrivateRoom (CreatePrivateRoomDto createPrivateRoomDto) {

        String name = createPrivateRoomDto.getName();
        String password = createPrivateRoomDto.getPassword();
        String  playerId = createPrivateRoomDto.getPlayerId();

        Player roomOwner = lobby.getPlayer(playerId);
        if (roomOwner == null) throw new IllegalStateException("Player not found");
        Room room =  lobby.createPrivateRoom(name,roomOwner,password);

        return roomMapper.roomToRoomDto(room);
    }


    public RoomDto joinPublicRoom (JoinRoomDto joinRoomDto){
        Player player = lobby.getPlayer(joinRoomDto.getPlayerId());
        Room room = lobby.getRoom(joinRoomDto.getRoomId());

        if (player == null) {
            throw new IllegalStateException("Player does not exist");
        }

        if (room == null) {
            throw new IllegalStateException("Room does not exists");
        }

        room.addPlayer(player);

        broadcastRooms();
        broadcastRoom(joinRoomDto.getRoomId());

        return roomMapper.roomToRoomDto(room);
    }


    public void leaveRoom(LeaveRoomDto leaveRoomDto) {

        Player player = lobby.getPlayer(leaveRoomDto.getPlayerId());
        Room room = lobby.getRoom(leaveRoomDto.getRoomId());

        if (player == null || room == null)
            throw new RuntimeException("Player or Room not found");

        room.removePlayer(player);

        if (room.getRoomOwner().getId().equals(leaveRoomDto.getPlayerId()) && !room.getPlayers().isEmpty()) {
            room.setRoomOwner(room.getPlayers().get(0));
        }

        if (room.getPlayers().isEmpty()) {
            lobby.removeRoom(leaveRoomDto.getRoomId());
        }

        broadcastRooms();
        broadcastRoom(leaveRoomDto.getRoomId());
    }
}