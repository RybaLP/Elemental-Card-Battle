package com.elemental_card_battle.elemental_card_battle.room;

import com.elemental_card_battle.elemental_card_battle.dto.room.*;
import com.elemental_card_battle.elemental_card_battle.exception.room.InvalidRoomPasswordException;
import com.elemental_card_battle.elemental_card_battle.exception.room.NotRoomOwnerException;
import com.elemental_card_battle.elemental_card_battle.exception.room.RoomFullException;
import com.elemental_card_battle.elemental_card_battle.exception.room.RoomNotFoundException;
import com.elemental_card_battle.elemental_card_battle.manager.Lobby;
import com.elemental_card_battle.elemental_card_battle.mapper.RoomMapper;
import com.elemental_card_battle.elemental_card_battle.model.Room;
import com.elemental_card_battle.elemental_card_battle.session.ActiveSession;
import com.elemental_card_battle.elemental_card_battle.session.ActiveSessionManager;
import com.elemental_card_battle.elemental_card_battle.session.SessionStatus;
import com.elemental_card_battle.elemental_card_battle.user.User;
import com.elemental_card_battle.elemental_card_battle.user.UserService;
import com.elemental_card_battle.elemental_card_battle.user.dto.UserProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final Lobby lobby;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final RoomMapper roomMapper;
    private final ActiveSessionManager activeSessionManager;
    private final UserService userService;

    private static final List<String> BOT_NAMES = List.of(
            "ShadowWarrior67", "VenomMenon", "IronPhantom", "DarkSerpent",
            "FrostReaper", "BlazeCrusher", "StormBringer", "NightStalker",
            "CrimsonFang", "ThunderWolf", "SilentBlade", "AshBringer",
            "VoidWalker", "RuneBreaker", "IceDrifter"
    );

    private static final Random RANDOM = new Random();


//    helper functions

    private ActiveSession getCurrentSession(String email) {
        ActiveSession session = activeSessionManager.getSessionByEmail(email);
        if (session == null) throw new IllegalArgumentException("No active session for:" + email);
        return session;
    }

    private void broadcastRooms() {
        List<RoomDto> rooms = lobby.getRooms().stream()
                        .map(roomMapper :: roomToRoomDto)
                                .toList();
        simpMessagingTemplate.convertAndSend("/topic/rooms", rooms);
    }

    private void broadcastRoom(String roomId) {
        Room room = lobby.getRoom(roomId);
        if (room != null) {
            simpMessagingTemplate.convertAndSend(
                    "/topic/room/" + roomId,
                    roomMapper.roomToRoomDto(room)
            );
        }
    }

//    ==========================================================================================

    public List<RoomDto> findAllRooms() {
        return lobby.getRooms().stream()
                .map(roomMapper::roomToRoomDto)
                .toList();
    }

    public RoomDto getCurrentRoom(String email) {
        Long userId = userService.getUserProfile(email).id();
        Room room = lobby.getRoomByUserId(userId);
        if (room == null) {
            throw new RoomNotFoundException("User is not currently in any room");
        }
        return roomMapper.roomToRoomDto(room);
    }

    public RoomDto getRoomById(String roomId) {
        Room room = lobby.getRoom(roomId);
        if (room == null) throw new RoomNotFoundException(roomId);
        return roomMapper.roomToRoomDto(room);
    }

    public RoomDto createPublicRoom(CreatePublicRoomDto dto, String email) {
        ActiveSession session = getCurrentSession(email);
        Room room = lobby.createPublicRoom(dto.name(), session);
        session.setStatus(SessionStatus.IN_ROOM);
        session.setCurrentRoomId(room.getId());;
        broadcastRooms();
        return roomMapper.roomToRoomDto(room);
    }

    public RoomDto createPrivateRoom(CreatePrivateRoomDto dto , String email) {

        if (dto.password() == null || dto.password().isBlank()) {
            throw new InvalidRoomPasswordException("");
        }

        ActiveSession session = getCurrentSession(email);
        Room room = lobby.createPrivateRoom(dto.name(), session, dto.password());
        session.setStatus(SessionStatus.IN_ROOM);
        session.setCurrentRoomId(room.getId());
        broadcastRooms();
        return roomMapper.roomToRoomDto(room);
    }

    public void leaveRoom (String email) {
        User user = userService.findUserByEmail(email);
        Room room = lobby.getRoomByUserId(user.getId());
        room.getPlayers().removeIf(p -> p.getUserId() == user.getId());
        room.setFull(room.getPlayers().size() >= 2);

        ActiveSession session = activeSessionManager.getSessions(user.getId());
        if (session != null) {
            session.setStatus(SessionStatus.ONLINE);
            session.setCurrentRoomId(null);
        }

        boolean wasOwner = room.getRoomOwner().getUserId() != null
                && room.getRoomOwner().getUserId().equals(user.getId());

        boolean onlyBotLeft = room.getPlayers().size() == 1
                && room.getPlayers().get(0).getUserId() == null;

        if (room.getPlayers().isEmpty() || onlyBotLeft) {
            lobby.removeRoom(room.getId());
            broadcastRooms();
            return;
        }

        if (wasOwner) {
            room.setRoomOwner(room.getPlayers().get(0));
        }

        broadcastRooms();
        broadcastRoom(room.getId());
    }


    public RoomDto joinRoom (JoinRoomDto joinRoomDto , String email) {
        ActiveSession session = getCurrentSession(email);
        Room room = lobby.getRoom(joinRoomDto.roomId());

        if (room.isPrivate()) {
            if (joinRoomDto.password() == null || !joinRoomDto.password().equals(room.getPassword())) {
                throw new InvalidRoomPasswordException("Invalid room password");
            }
        }

        room.addPlayer(session);
        session.setStatus(SessionStatus.IN_ROOM);
        session.setCurrentRoomId(room.getId());

        broadcastRooms();
        broadcastRoom(room.getId());

        return roomMapper.roomToRoomDto(room);
    }

    public RoomDto addBot(String roomId, String email) {
        ActiveSession activeSession = getCurrentSession(email);
        Room room = lobby.getRoom(roomId);

        if (room == null) throw new RoomNotFoundException(roomId);

        if (!room.getRoomOwner().getUserId().equals(activeSession.getUserId())) {
            throw new NotRoomOwnerException();
        }

        if (room.isFull()) {
            throw new RoomFullException();
        }

        ActiveSession botSession = ActiveSession.builder()
                .userId(null)
                .nickname(BOT_NAMES.get(RANDOM.nextInt(BOT_NAMES.size())))
                .status(SessionStatus.IN_ROOM)
                .currentRoomId(roomId)
                .build();

        room.addPlayer(botSession);

        broadcastRooms();
        broadcastRoom(roomId);

        return roomMapper.roomToRoomDto(room);
    }

    public RoomDto kickBot(String roomId, String email) {
        ActiveSession activeSession = getCurrentSession(email);
        Room room = lobby.getRoom(roomId);

        if (room == null) throw new RoomNotFoundException(roomId);

        if (!room.getRoomOwner().getUserId().equals(activeSession.getUserId())) {
            throw new NotRoomOwnerException();
        }

        room.getPlayers().removeIf(p -> p.getUserId() == null);
        room.setFull(room.getPlayers().size() >= 2);

        broadcastRooms();
        broadcastRoom(roomId);

        return roomMapper.roomToRoomDto(room);
    }

}