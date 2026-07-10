package com.elemental_card_battle.elemental_card_battle.room;

import com.elemental_card_battle.elemental_card_battle.dto.room.*;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.elemental_card_battle.elemental_card_battle.dto.room.*;
import org.springframework.web.bind.annotation.*;


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
    public ResponseEntity<RoomDto> createPublicRoom(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CreatePublicRoomDto dto) {
        String email = userDetails.getUsername();
        RoomDto room = roomService.createPublicRoom(dto, email);
        return ResponseEntity.ok(room);
    }

    @Operation(summary = "Create private room", description = "Creates a new private room that any player can join")
    @PostMapping("/create-private")
    public ResponseEntity<RoomDto> createPrivateRoom (@AuthenticationPrincipal UserDetails userDetails,
                                                      @RequestBody CreatePrivateRoomDto dto) {
        String email = userDetails.getUsername();
        RoomDto room = roomService.createPrivateRoom(dto, email);
        return ResponseEntity.ok(room);
    }

    @GetMapping("/current")
    public ResponseEntity<RoomDto> getCurrentRoomOfUser (@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        RoomDto roomDto = roomService.getCurrentRoom(email);
        return ResponseEntity.ok(roomDto);
    }

    @PostMapping("/join")
    public ResponseEntity<RoomDto> joinRoom (@AuthenticationPrincipal UserDetails userDetails, @RequestBody JoinRoomDto joinRoomDto) {
        String email = userDetails.getUsername();
        RoomDto roomDto = roomService.joinRoom(joinRoomDto,email);
        return ResponseEntity.ok(roomDto);
    }

    @Operation(summary = "Leave room", description = "Removes the player from the room")
    @PostMapping("/leave")
    public ResponseEntity<Void> leaveRoom (@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        roomService.leaveRoom(email);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/add-bot")
    public ResponseEntity<RoomDto> addBot (@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        RoomDto roomDto = roomService.addBot(email);
        return ResponseEntity.ok(roomDto);
    }

    @PostMapping("/kick-bot")
    public ResponseEntity<RoomDto> kickBot (@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        RoomDto roomDto = roomService.kickBot(email);
        return ResponseEntity.ok(roomDto);
    }

    @PostMapping("/kick-player")
    public ResponseEntity<RoomDto> kickPlayer(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        return ResponseEntity.ok(roomService.kickPlayer(email));
    }

}