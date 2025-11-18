package com.elemental_card_battle.elemental_card_battle.controler;

import com.elemental_card_battle.elemental_card_battle.dto.room.*;
import com.elemental_card_battle.elemental_card_battle.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<List<RoomDto>> getAllRooms () {
        List<RoomDto> allRooms = roomService.findAllRooms();
        return ResponseEntity.ok(allRooms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDto> getRoomById (@PathVariable(name = "id") String id) {
        RoomDto roomDto = roomService.getRoomById(id);
        return ResponseEntity.ok(roomDto);
    }

    @PostMapping("/create-public")
    public ResponseEntity <RoomDto> createPublicRoom (@RequestBody CreatePublicRoomDto createPublicRoomDto) {
        RoomDto room =  roomService.createPublicRoom(createPublicRoomDto);
        return ResponseEntity.ok(room);
    }

    @PostMapping("/create-private")
    public ResponseEntity <RoomDto> createPrivateRoom (@RequestBody CreatePrivateRoomDto createPrivateRoomDto) {
        RoomDto room = roomService.createPrivateRoom(createPrivateRoomDto);
        return ResponseEntity.ok(room);
    }

    @PostMapping("/join-public")
    public ResponseEntity<RoomDto> joinPublicRoom (@RequestBody JoinRoomDto joinRoomDto) {
        RoomDto roomDto = roomService.joinPublicRoom(joinRoomDto);
        return ResponseEntity.ok(roomDto);
    }

    @PostMapping("/leave")
    public ResponseEntity<Void> leaveRoom (@RequestBody LeaveRoomDto leaveRoomDto) {
        roomService.leaveRoom(leaveRoomDto);
        return ResponseEntity.noContent().build();
    }
}