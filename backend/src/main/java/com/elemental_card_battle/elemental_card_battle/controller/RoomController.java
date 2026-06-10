package com.elemental_card_battle.elemental_card_battle.controller;

import com.elemental_card_battle.elemental_card_battle.dto.room.*;
import com.elemental_card_battle.elemental_card_battle.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService roomService;

    @Operation(summary = "Get all rooms", description = "Returns a list of all available game rooms")
    @GetMapping
    public ResponseEntity<List<RoomDto>> getAllRooms () {
        List<RoomDto> allRooms = roomService.findAllRooms();
        return ResponseEntity.ok(allRooms);
    }

    @Operation(summary = "Get room by ID", description = "Returns details of a specific room")
    @GetMapping("/{id}")
    public ResponseEntity<RoomDto> getRoomById (@PathVariable(name = "id") String id) {
        RoomDto roomDto = roomService.getRoomById(id);
        return ResponseEntity.ok(roomDto);
    }

    @Operation(summary = "Create public room", description = "Creates a new public room that any player can join")
    @PostMapping("/create-public")
    public ResponseEntity <RoomDto> createPublicRoom (@RequestBody CreatePublicRoomDto createPublicRoomDto) {
        RoomDto room =  roomService.createPublicRoom(createPublicRoomDto);
        return ResponseEntity.ok(room);
    }

    @Operation(summary = "Create private room", description = "Creates a password-protected private room")
    @PostMapping("/create-private")
    public ResponseEntity <RoomDto> createPrivateRoom (@RequestBody CreatePrivateRoomDto createPrivateRoomDto) {
        RoomDto room = roomService.createPrivateRoom(createPrivateRoomDto);
        return ResponseEntity.ok(room);
    }

    @Operation(summary = "Join public room", description = "Joins an existing public game room")
    @PostMapping("/join-public")
    public ResponseEntity<RoomDto> joinPublicRoom (@RequestBody JoinRoomDto joinRoomDto) {
        RoomDto roomDto = roomService.joinPublicRoom(joinRoomDto);
        return ResponseEntity.ok(roomDto);
    }

    @Operation(summary = "Add bot", description = "Adds an AI bot to the specified room")
    @PostMapping("/add-bot")
    public ResponseEntity<RoomDto> addBot (@RequestBody BotRequestDto botRequestDto) {
        RoomDto roomDto = roomService.addBotToRoom(botRequestDto);
        return ResponseEntity.ok(roomDto);
    }

    @Operation(summary = "Kick bot", description = "Removes an AI bot from the specified room")
    @PostMapping("/kick-bot")
    public ResponseEntity<RoomDto> removeBot (@RequestBody BotRequestDto botRequestDto) {
        RoomDto roomDto = roomService.removeBot(botRequestDto);
        return ResponseEntity.ok(roomDto);
    }

    @Operation(summary = "Leave room", description = "Removes the player from the room")
    @PostMapping("/leave")
    public ResponseEntity<Void> leaveRoom (@RequestBody LeaveRoomDto leaveRoomDto) {
        roomService.leaveRoom(leaveRoomDto);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Leave and delete room", description = "Player leaves and permanently deletes the room")
    @DeleteMapping("/leave-and-delete")
    public ResponseEntity<Void> leaveRoomAndDelete (@RequestBody LeaveRoomDto leaveRoomDto) {
        roomService.leaveRoomAndDelete(leaveRoomDto);
        return ResponseEntity.noContent().build();
    }
}