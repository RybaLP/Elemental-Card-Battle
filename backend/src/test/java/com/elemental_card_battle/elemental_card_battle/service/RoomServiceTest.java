//package com.elemental_card_battle.elemental_card_battle.service;
//
//import com.elemental_card_battle.elemental_card_battle.dto.room.RoomDto;
//import com.elemental_card_battle.elemental_card_battle.manager.Lobby;
//import com.elemental_card_battle.elemental_card_battle.mapper.RoomMapper;
//import com.elemental_card_battle.elemental_card_battle.model.Player;
//import com.elemental_card_battle.elemental_card_battle.model.Room;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Nested;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//
//@ExtendWith(MockitoExtension.class)
//@DisplayName("Room service unit tests")
//class RoomServiceTest {
//
//    @Mock
//    private Lobby lobby;
//
//    @Mock
//    private SimpMessagingTemplate simpMessagingTemplate;
//
//    @Mock
//    private RoomMapper roomMapper;
//
//    @Mock
//    private BotService botService;
//
//    @InjectMocks
//    private  RoomService roomService;
//
//    private Player owner;
//    private Player guest;
//    private Player bot;
//    private Room room;
//    private RoomDto roomDto;
//
//    @BeforeEach
//    void setup() {
//        owner = Player.builder()
//                .id("owner-id")
//                .nickname("Owner")
//                .isBot(false)
//                .build();
//
//        guest = Player.builder()
//                .id("guest-id")
//                .nickname("Guest")
//                .isBot(false)
//                .build();
//
//        bot = Player.builder()
//                .id("bot-id")
//                .nickname("ShadowWarrior67")
//                .isBot(true)
//                .build();
//
//        room = Room.builder()
//                .id("room-id")
//                .name("Test Room")
//                .roomOwner(owner)
//                .isPrivate(false)
//                .build();
//
//        room.addPlayer(owner);
//
//        roomDto = new RoomDto("room-id", "Test Room", false, false, "owner-id", List.of());
//    }
//
//    @Nested
//    @DisplayName("addBotToRoom tests")
//    class AddBotToRoom {
//        @Test
//        @DisplayName("Should throw when room not found")
//    }
//
//
//}