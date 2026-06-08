package com.elemental_card_battle.elemental_card_battle.exception.handler;

import com.elemental_card_battle.elemental_card_battle.exception.GameException;
import com.elemental_card_battle.elemental_card_battle.exception.card.CardNotFoundException;
import com.elemental_card_battle.elemental_card_battle.exception.game.GameSessionNotFoundException;
import com.elemental_card_battle.elemental_card_battle.exception.player.InvalidPlayerNicknameException;
import com.elemental_card_battle.elemental_card_battle.exception.player.PlayerNotFoundException;
import com.elemental_card_battle.elemental_card_battle.exception.room.NotRoomOwnerException;
import com.elemental_card_battle.elemental_card_battle.exception.room.RoomFullException;
import com.elemental_card_battle.elemental_card_battle.exception.room.RoomNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RoomNotFoundException.class)
    public ResponseEntity<String> handleRoomNotFound (RoomNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(PlayerNotFoundException.class)
    public ResponseEntity<String> handlePlayerNotFound(PlayerNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(NotRoomOwnerException.class)
    public ResponseEntity<String> handleNotRoomOwner(NotRoomOwnerException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    @ExceptionHandler(RoomFullException.class)
    public ResponseEntity<String> handleRoomFull(RoomFullException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(GameException.class)
    public ResponseEntity<String> handleGameException(GameException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(GameSessionNotFoundException.class)
    public ResponseEntity<String> handleGameNotFoundException (GameSessionNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(CardNotFoundException.class)
    public ResponseEntity<String> handleCardNotFoundException (CardNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(InvalidPlayerNicknameException.class)
    public ResponseEntity<String> handleInvalidNickname(InvalidPlayerNicknameException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

}