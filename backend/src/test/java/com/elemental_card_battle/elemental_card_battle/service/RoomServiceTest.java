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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Room service unit tests")
class RoomServiceTest {

    @Mock private Lobby lobby;
    @Mock private SimpMessagingTemplate simpMessagingTemplate;
    @Mock private RoomMapper roomMapper;
    @Mock private BotService botService;

    @InjectMocks
    private RoomService roomService;

    private Player owner;
    private Player guest;
    private Player bot;
    private Room room;
    private RoomDto roomDto;

    @BeforeEach
    void setup() {
        owner = Player.builder()
                .id("owner-id")
                .nickname("Owner")
                .isBot(false)
                .build();

        guest = Player.builder()
                .id("guest-id")
                .nickname("Guest")
                .isBot(false)
                .build();

        bot = Player.builder()
                .id("bot-id")
                .nickname("ShadowWarrior67")
                .isBot(true)
                .build();

        room = Room.builder()
                .id("room-id")
                .name("Test Room")
                .roomOwner(owner)
                .isPrivate(false)
                .build();

        room.addPlayer(owner);

        roomDto = new RoomDto("room-id", "Test Room", false, false, "owner-id", List.of());
    }

    @Nested
    @DisplayName("addBotToRoom tests")
    class AddBotToRoom {

        @Test
        @DisplayName("Should throw RoomNotFoundException when room not found")
        void shouldThrowWhenRoomNotFound() {
            when(lobby.getRoom("room-id")).thenReturn(null);

            assertThrows(RoomNotFoundException.class,
                    () -> roomService.addBotToRoom(new BotRequestDto("room-id", "owner-id")));

            verify(lobby).getRoom("room-id");
            verifyNoMoreInteractions(botService);
        }

        @Test
        @DisplayName("Should throw NotRoomOwnerException when player is not owner")
        void shouldThrowWhenNotOwner() {
            when(lobby.getRoom("room-id")).thenReturn(room);

            assertThrows(NotRoomOwnerException.class,
                    () -> roomService.addBotToRoom(new BotRequestDto("room-id", "not-owner-id")));

            verifyNoMoreInteractions(botService);
        }

        @Test
        @DisplayName("Should throw RoomFullException when room is full")
        void shouldThrowWhenRoomFull() {
            room.addPlayer(guest);
            when(lobby.getRoom("room-id")).thenReturn(room);

            assertThrows(RoomFullException.class,
                    () -> roomService.addBotToRoom(new BotRequestDto("room-id", "owner-id")));

            verifyNoMoreInteractions(botService);
        }

        @Test
        @DisplayName("Should add bot successfully")
        void shouldAddBotSuccessfully() {
            when(lobby.getRoom("room-id")).thenReturn(room);
            when(botService.generateBot()).thenReturn(bot);
            when(roomMapper.roomToRoomDto(room)).thenReturn(roomDto);

            RoomDto result = roomService.addBotToRoom(new BotRequestDto("room-id", "owner-id"));

            assertNotNull(result);
            assertTrue(room.getPlayers().stream().anyMatch(Player::isBot));
            verify(lobby).addPlayer(bot);
            verify(botService).generateBot();
        }
    }

    @Nested
    @DisplayName("removeBot tests")
    class RemoveBot {

        @Test
        @DisplayName("Should throw RoomNotFoundException when room not found")
        void shouldThrowWhenRoomNotFound() {
            when(lobby.getRoom("room-id")).thenReturn(null);

            assertThrows(RoomNotFoundException.class,
                    () -> roomService.removeBot(new BotRequestDto("room-id", "owner-id")));
        }

        @Test
        @DisplayName("Should remove bot successfully")
        void shouldRemoveBotSuccessfully() {
            room.addPlayer(bot);
            when(lobby.getRoom("room-id")).thenReturn(room);
            when(roomMapper.roomToRoomDto(room)).thenReturn(roomDto);

            RoomDto result = roomService.removeBot(new BotRequestDto("room-id", "owner-id"));

            assertNotNull(result);
            assertFalse(room.getPlayers().stream().anyMatch(Player::isBot));
            verify(lobby).removePlayer(bot.getId());
        }
    }

    @Nested
    @DisplayName("leaveRoom tests")
    class LeaveRoom {

        @Test
        @DisplayName("Should throw PlayerNotFoundException when player not found")
        void shouldThrowWhenPlayerNotFound() {
            when(lobby.getPlayer("owner-id")).thenReturn(null);

            assertThrows(PlayerNotFoundException.class,
                    () -> roomService.leaveRoom(new LeaveRoomDto("owner-id", "room-id")));
        }

        @Test
        @DisplayName("Should throw RoomNotFoundException when room not found")
        void shouldThrowWhenRoomNotFound() {
            when(lobby.getPlayer("owner-id")).thenReturn(owner);
            when(lobby.getRoom("room-id")).thenReturn(null);

            assertThrows(RoomNotFoundException.class,
                    () -> roomService.leaveRoom(new LeaveRoomDto("owner-id", "room-id")));
        }

        @Test
        @DisplayName("Should remove room when last player leaves")
        void shouldRemoveRoomWhenLastPlayerLeaves() {
            when(lobby.getPlayer("owner-id")).thenReturn(owner);
            when(lobby.getRoom("room-id")).thenReturn(room);

            roomService.leaveRoom(new LeaveRoomDto("owner-id", "room-id"));

            verify(lobby).removeRoom("room-id");
        }
    }

    @Nested
    @DisplayName("getRoomById tests")
    class GetRoomById {

        @Test
        @DisplayName("Should throw RoomNotFoundException when room not found")
        void shouldThrowWhenRoomNotFound() {
            when(lobby.getRoom("room-id")).thenReturn(null);

            assertThrows(RoomNotFoundException.class,
                    () -> roomService.getRoomById("room-id"));
        }

        @Test
        @DisplayName("Should return room when found")
        void shouldReturnRoomWhenFound() {
            when(lobby.getRoom("room-id")).thenReturn(room);
            when(roomMapper.roomToRoomDto(room)).thenReturn(roomDto);

            RoomDto result = roomService.getRoomById("room-id");

            assertNotNull(result);
            assertEquals("room-id", result.id());
            verify(lobby).getRoom("room-id");
        }
    }
}