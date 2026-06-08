package com.elemental_card_battle.elemental_card_battle.service;

import com.elemental_card_battle.elemental_card_battle.dto.room.*;
import com.elemental_card_battle.elemental_card_battle.exception.player.PlayerNotFoundException;
import com.elemental_card_battle.elemental_card_battle.exception.room.NotRoomOwnerException;
import com.elemental_card_battle.elemental_card_battle.exception.room.RoomFullException;
import com.elemental_card_battle.elemental_card_battle.exception.room.RoomNotFoundException;
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
    private  final BotService botService;

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
            throw new RoomNotFoundException(roomId);
        }
        return roomMapper.roomToRoomDto(room);
    }

    public RoomDto createPublicRoom (CreatePublicRoomDto createPublicRoomDto) {

        String playerId = createPublicRoomDto.playerId();
        String name = createPublicRoomDto.name();

        Player roomOwner = lobby.getPlayer(playerId);
        if (roomOwner == null) throw new PlayerNotFoundException(playerId);
        Room room = lobby.createPublicRoom(name, roomOwner);
        broadcastRooms();
        return roomMapper.roomToRoomDto(room);
    }

    public RoomDto createPrivateRoom (CreatePrivateRoomDto createPrivateRoomDto) {

        String name = createPrivateRoomDto.name();
        String password = createPrivateRoomDto.password();
        String  playerId = createPrivateRoomDto.playerId();

        Player roomOwner = lobby.getPlayer(playerId);
        if (roomOwner == null) throw new PlayerNotFoundException(createPrivateRoomDto.playerId());
        Room room =  lobby.createPrivateRoom(name,roomOwner,password);

        return roomMapper.roomToRoomDto(room);
    }


    public RoomDto joinPublicRoom (JoinRoomDto joinRoomDto){
        Player player = lobby.getPlayer(joinRoomDto.playerId());
        Room room = lobby.getRoom(joinRoomDto.roomId());

        if (player == null) {
            throw new PlayerNotFoundException(joinRoomDto.playerId());
        }

        if (room == null) {
            throw new RoomNotFoundException(joinRoomDto.roomId());
        }

        room.addPlayer(player);

        broadcastRooms();
        broadcastRoom(joinRoomDto.roomId());

        return roomMapper.roomToRoomDto(room);
    }

//    bot section
    public RoomDto addBotToRoom (BotRequestDto addBotRequest) {
        Room room = lobby.getRoom(addBotRequest.roomId());
        if (room == null) throw new RoomNotFoundException(addBotRequest.roomId());

        if (!room.getRoomOwner().getId().equals(addBotRequest.ownerId())) {
            throw new NotRoomOwnerException();
        }

        if (room.isFull()) throw new RoomFullException();

        Player botPlayer = botService.generateBot();
        lobby.addPlayer(botPlayer);
        room.addPlayer(botPlayer);

        broadcastRooms();
        broadcastRoom(addBotRequest.roomId());

        return roomMapper.roomToRoomDto(room);
    }

    public RoomDto removeBot (BotRequestDto botRequestDto) {
        Room room = lobby.getRoom(botRequestDto.roomId());
        if (room == null) {
            throw new RoomNotFoundException(botRequestDto.roomId());
        }

        room.getPlayers().stream()
                .filter(Player::isBot)
                .findFirst()
                .ifPresent(bot -> {
                    room.removePlayer(bot);
                    lobby.removePlayer(bot.getId());
                });

        broadcastRooms();
        broadcastRoom(botRequestDto.roomId());

        return roomMapper.roomToRoomDto(room);
    }
//

    public void leaveRoom(LeaveRoomDto leaveRoomDto) {

        Player player = lobby.getPlayer(leaveRoomDto.playerId());
        Room room = lobby.getRoom(leaveRoomDto.roomId());

        if (player == null) throw new PlayerNotFoundException(leaveRoomDto.playerId());
        if (room == null) throw new RoomNotFoundException(leaveRoomDto.roomId());

        room.removePlayer(player);

        if (room.getRoomOwner().getId().equals(leaveRoomDto.playerId()) && !room.getPlayers().isEmpty()) {
            room.setRoomOwner(room.getPlayers().getFirst());
        }

        if (room.getPlayers().isEmpty()) {
            lobby.removeRoom(leaveRoomDto.roomId());
        }

        broadcastRooms();
        broadcastRoom(leaveRoomDto.roomId());
    }

    public void leaveRoomAndDelete(LeaveRoomDto leaveRoomDto) {
        Room room = lobby.getRoom(leaveRoomDto.roomId());

        if (room == null) {
            return;
        }

        lobby.removeRoom(room.getId());

        simpMessagingTemplate.convertAndSend("/topic/rooms", lobby.getRooms());
    }

}