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
                .nickname("Bot")
                .status(SessionStatus.IN_ROOM)
                .currentRoomId(roomId)
                .build();

        room.addPlayer(botSession);
        broadcastRooms();
        return roomMapper.roomToRoomDto(room);
    }

    public RoomDto removeBot(String roomId, String email) {
        ActiveSession activeSession = getCurrentSession(email);
        Room room = lobby.getRoom(roomId);

        if (room == null) throw new RoomNotFoundException(roomId);
        if (!room.getRoomOwner().getUserId().equals(activeSession.getUserId())) {
            throw new NotRoomOwnerException();
        }

        room.getPlayers().removeIf(p -> p.getUserId() == null);
        room.setFull(room.getPlayers().size() >= 2);

        broadcastRooms();
        return roomMapper.roomToRoomDto(room);
    }

//    public RoomDto createPrivateRoom(CreatePrivateRoomDto dto) {
//        ActiveSession session = getCurrentSession();
//        Room room = lobby.createPrivateRoom(dto.name(), session, dto.password());
//        session.setStatus(SessionStatus.IN_ROOM);
//        session.setCurrentRoomId(room.getId());
//        return roomMapper.roomToRoomDto(room);
//    }

//    public RoomDto joinRoom(JoinRoomDto dto) {
//        ActiveSession session = getCurrentSession();
//        Room room = lobby.getRoom(dto.roomId());
//
//        if (room == null) throw new RoomNotFoundException(dto.roomId());
//        if (room.isFull()) throw new RoomFullException();
//
//        if (room.isPrivate()) {
//            if (dto.password() == null || !dto.password().equals(room.getPassword())) {
//                throw new InvalidRoomPasswordException("error");
//            }
//        }
//
//        room.addPlayer(session);
//        session.setStatus(SessionStatus.IN_ROOM);
//        session.setCurrentRoomId(dto.roomId());
//
//        broadcastRooms();
//        broadcastRoom(dto.roomId());
//
//        return roomMapper.roomToRoomDto(room);
//    }
//
//    public RoomDto addBotToRoom(BotRequestDto dto) {
//        ActiveSession session = getCurrentSession();
//        Room room = lobby.getRoom(dto.roomId());
//
//        if (room == null) throw new RoomNotFoundException(dto.roomId());
//        if (!room.getRoomOwner().getUserId().equals(session.getUserId())) throw new NotRoomOwnerException();
//        if (room.isFull()) throw new RoomFullException();
//
//        ActiveSession bot = ActiveSession.builder()
//                .userId(-1L)
//                .email("bot@bot")
//                .nickname(BOT_NAMES.get(RANDOM.nextInt(BOT_NAMES.size())))
//                .simpSessionId(null)
//                .status(SessionStatus.IN_ROOM)
//                .currentRoomId(dto.roomId())
//                .build();
//
//        room.addPlayer(bot);
//
//        broadcastRooms();
//        broadcastRoom(dto.roomId());
//
//        return roomMapper.roomToRoomDto(room);
//    }
//
//    public RoomDto removeBot(BotRequestDto dto) {
//        ActiveSession session = getCurrentSession();
//        Room room = lobby.getRoom(dto.roomId());
//
//        if (room == null) throw new RoomNotFoundException(dto.roomId());
//        if (!room.getRoomOwner().getUserId().equals(session.getUserId())) throw new NotRoomOwnerException();
//
//        room.getPlayers().stream()
//                .filter(s -> s.getUserId().equals(-1L))
//                .findFirst()
//                .ifPresent(room::removePlayer);
//
//        broadcastRooms();
//        broadcastRoom(dto.roomId());
//
//        return roomMapper.roomToRoomDto(room);
//    }
//
//
//    public void leaveRoom(LeaveRoomDto dto) {
//        ActiveSession session = getCurrentSession();
//        Room room = lobby.getRoom(dto.roomId());
//
//        if (room == null) throw new RoomNotFoundException(dto.roomId());
//
//        room.removePlayer(session);
//        session.setStatus(SessionStatus.ONLINE);
//        session.setCurrentRoomId(null);
//
//        if (room.getRoomOwner().getUserId().equals(session.getUserId()) && !room.getPlayers().isEmpty()) {
//            room.setRoomOwner(room.getPlayers().getFirst());
//        }
//
//        if (room.getPlayers().isEmpty()) {
//            lobby.removeRoom(dto.roomId());
//        }
//
//        broadcastRooms();
//        broadcastRoom(dto.roomId());
//    }
//
//    public void leaveRoomAndDelete(LeaveRoomDto dto) {
//        ActiveSession session = getCurrentSession();
//        Room room = lobby.getRoom(dto.roomId());
//
//        if (room == null) return;
//        if (!room.getRoomOwner().getUserId().equals(session.getUserId())) throw new NotRoomOwnerException();
//
//        room.getPlayers().forEach(s -> {
//            s.setStatus(SessionStatus.ONLINE);
//            s.setCurrentRoomId(null);
//        });
//
//        lobby.removeRoom(room.getId());
//        simpMessagingTemplate.convertAndSend("/topic/rooms", lobby.getRooms());
//    }
}