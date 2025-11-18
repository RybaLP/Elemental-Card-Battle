package com.elemental_card_battle.elemental_card_battle.mapper;

import com.elemental_card_battle.elemental_card_battle.dto.room.RoomDto;
import com.elemental_card_battle.elemental_card_battle.model.Room;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    RoomDto roomToRoomDto (Room room);
}