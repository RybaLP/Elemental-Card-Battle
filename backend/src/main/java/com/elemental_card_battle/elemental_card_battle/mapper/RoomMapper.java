package com.elemental_card_battle.elemental_card_battle.mapper;

import com.elemental_card_battle.elemental_card_battle.dto.room.RoomDto;
import com.elemental_card_battle.elemental_card_battle.model.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoomMapper {

    @Mapping(source = "roomOwner.id", target = "roomOwnerId")
    @Mapping(source = "private", target = "isPrivate")
    @Mapping(source = "full", target = "isFull")
    RoomDto roomToRoomDto (Room room);
}