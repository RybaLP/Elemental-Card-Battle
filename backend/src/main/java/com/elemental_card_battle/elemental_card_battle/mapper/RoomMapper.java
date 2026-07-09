package com.elemental_card_battle.elemental_card_battle.mapper;

import com.elemental_card_battle.elemental_card_battle.dto.room.RoomDto;
import com.elemental_card_battle.elemental_card_battle.gamesession.dto.SessionDto;
import com.elemental_card_battle.elemental_card_battle.model.Room;
import com.elemental_card_battle.elemental_card_battle.session.ActiveSession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoomMapper {

    @Mapping(source = "roomOwner.userId", target = "roomOwnerId")
    @Mapping(source = "private", target = "isPrivate")
    @Mapping(source = "full", target = "isFull")
    @Mapping(source = "players", target = "players")
    @Mapping(source = "messages", target = "messages")
    RoomDto roomToRoomDto(Room room);

    default SessionDto sessionToSessionDto(ActiveSession session) {
        boolean isBot = session.getUserId() == null;
        return new SessionDto(session.getUserId(), session.getNickname(), isBot);
    }

    default List<SessionDto> map(List<ActiveSession> sessions) {
        return sessions.stream()
                .map(this::sessionToSessionDto)
                .toList();
    }
}