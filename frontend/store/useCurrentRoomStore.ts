import {create} from "zustand";
import { Room } from "@/types/room";

interface RoomStore {
    currentRoom: Room | null;
    setCurrentRoom: (room: Room | null) => void;
}

export const useCurrentRoomStore = create<RoomStore>((set) => ({
     currentRoom: null,
     setCurrentRoom: (room) => set({ currentRoom: room }),
}));