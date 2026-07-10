package com.elemental_card_battle.elemental_card_battle.room;

import com.elemental_card_battle.elemental_card_battle.chatmessage.dto.ChatMessageDto;
import com.elemental_card_battle.elemental_card_battle.dto.room.*;
import com.elemental_card_battle.elemental_card_battle.exception.room.*;
import com.elemental_card_battle.elemental_card_battle.manager.Lobby;
import com.elemental_card_battle.elemental_card_battle.mapper.RoomMapper;
import com.elemental_card_battle.elemental_card_battle.model.Room;
import com.elemental_card_battle.elemental_card_battle.session.ActiveSession;
import com.elemental_card_battle.elemental_card_battle.session.ActiveSessionManager;
import com.elemental_card_battle.elemental_card_battle.session.SessionStatus;
import com.elemental_card_battle.elemental_card_battle.user.User;
import com.elemental_card_battle.elemental_card_battle.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoomService {

    private final Lobby lobby;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final RoomMapper roomMapper;
    private final ActiveSessionManager activeSessionManager;
    private final UserService userService;

    private static final AtomicLong BOT_ID_COUNTER = new AtomicLong(-1);

    private Long generateBotId() {
        return BOT_ID_COUNTER.decrementAndGet();
    }

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
                .map(roomMapper::roomToRoomDto)
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

    public Room findRoomByUserId(Long userId) {
        return lobby.getRoomByUserId(userId);
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
        session.setCurrentRoomId(room.getId());
        broadcastRooms();
        return roomMapper.roomToRoomDto(room);
    }

    public RoomDto createPrivateRoom(CreatePrivateRoomDto dto, String email) {
        if (dto.password() == null || dto.password().isBlank()) {
            throw new InvalidRoomPasswordException("Password is required for a private room");
        }

        ActiveSession session = getCurrentSession(email);
        Room room = lobby.createPrivateRoom(dto.name(), session, dto.password());
        session.setStatus(SessionStatus.IN_ROOM);
        session.setCurrentRoomId(room.getId());
        broadcastRooms();
        return roomMapper.roomToRoomDto(room);
    }

    public void leaveRoom(String email) {
        User user = userService.findUserByEmail(email);
        Room room = lobby.getRoomByUserId(user.getId());

        if (room == null) {
            throw new RoomNotFoundException("User is not currently in any room");
        }

        room.getPlayers().removeIf(p -> user.getId().equals(p.getUserId()));
        room.setFull(room.getPlayers().size() >= 2);

        ActiveSession session = activeSessionManager.getSessions(user.getId());
        if (session != null) {
            session.setStatus(SessionStatus.ONLINE);
            session.setCurrentRoomId(null);
        }

        boolean wasOwner = room.getRoomOwner().getUserId() != null
                && room.getRoomOwner().getUserId().equals(user.getId());

        boolean onlyBotLeft = room.getPlayers().size() == 1
                && room.getPlayers().get(0).getUserId() < 0;

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

    public RoomDto joinRoom(JoinRoomDto joinRoomDto, String email) {
        ActiveSession session = getCurrentSession(email);
        Room room = lobby.getRoom(joinRoomDto.roomId());

        if (room == null) throw new RoomNotFoundException(joinRoomDto.roomId());
        if (room.isFull()) throw new RoomFullException();

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

    public RoomDto addBot(String email) {
        ActiveSession activeSession = getCurrentSession(email);
        String roomId = activeSession.getCurrentRoomId();
        if (roomId == null) {
            throw new IllegalStateException("You are not in a room");
        }
        Room room = lobby.getRoom(roomId);
        if (room == null) throw new RoomNotFoundException(roomId);

        if (!room.getRoomOwner().getUserId().equals(activeSession.getUserId())) {
            throw new NotRoomOwnerException();
        }

        if (room.isFull()) {
            throw new RoomFullException();
        }

        ActiveSession botSession = ActiveSession.builder()
                .userId(generateBotId())
                .nickname(BOT_NAMES.get(RANDOM.nextInt(BOT_NAMES.size())))
                .status(SessionStatus.IN_ROOM)
                .currentRoomId(roomId)
                .build();

        room.addPlayer(botSession);

        broadcastRooms();
        broadcastRoom(roomId);

        simpMessagingTemplate.convertAndSend("/topic/room/" + roomId + "/chat",
                new ChatMessageDto("System", null, "Bot " + botSession.getNickname() + " joined the lobby", System.currentTimeMillis(), roomId)
        );

        return roomMapper.roomToRoomDto(room);
    }

    public RoomDto kickBot(String email) {
        ActiveSession activeSession = getCurrentSession(email);
        String roomId = activeSession.getCurrentRoomId();
        if (roomId == null) {
            throw new IllegalStateException("You are not in a room");
        }
        Long userId = activeSession.getUserId();
        Room room = lobby.getRoom(roomId);
        if (room == null) throw new RoomNotFoundException(roomId);

        if (!room.getRoomOwner().getUserId().equals(userId)) {
            throw new NotRoomOwnerException();
        }

        room.getPlayers().stream()
                .filter(p -> p.getUserId() < 0)
                .findFirst()
                .ifPresent(bot -> {
                    room.getPlayers().remove(bot);
                    room.setFull(room.getPlayers().size() >= 2);

                    broadcastRooms();
                    broadcastRoom(room.getId());

                    simpMessagingTemplate.convertAndSend("/topic/room/" + room.getId() + "/chat",
                            new ChatMessageDto("System", null, "Bot left the lobby", System.currentTimeMillis(), room.getId())
                    );
                });

        return roomMapper.roomToRoomDto(room);
    }

    public RoomDto kickPlayer(String email) {
        ActiveSession owner = getCurrentSession(email);
        String roomId = owner.getCurrentRoomId();
        if (roomId == null) {
            throw new IllegalStateException("You are not in a room");
        }

        Room room = lobby.getRoom(roomId);
        if (room == null) {
            throw new RoomNotFoundException("Room not found for session");
        }

        if (!room.getRoomOwner().getUserId().equals(owner.getUserId())) {
            throw new NotRoomOwnerException();
        }

        ActiveSession playerToKick = room.getPlayers().stream()
                .filter(p -> !p.getUserId().equals(owner.getUserId()))
                .filter(p -> p.getUserId() >= 0)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No human player to kick"));

        room.getPlayers().remove(playerToKick);
        room.setFull(room.getPlayers().size() >= 2);

        ActiveSession kickedSession = activeSessionManager.getSessions(playerToKick.getUserId());
        if (kickedSession != null) {
            kickedSession.setStatus(SessionStatus.ONLINE);
            kickedSession.setCurrentRoomId(null);
        }

        broadcastRooms();
        broadcastRoom(room.getId());

        simpMessagingTemplate.convertAndSend("/topic/room/" + room.getId() + "/chat",
                new ChatMessageDto("System", null, playerToKick.getNickname() + " was kicked from the lobby",
                        System.currentTimeMillis(), room.getId()));

        return roomMapper.roomToRoomDto(room);
    }
}