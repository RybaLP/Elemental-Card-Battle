import {create} from "zustand";
import { Player } from "@/types/player";

interface PlayerStore {
    player : Player,
    setPlayer : (player : Player) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
    player : {
        nickname : "",
        id : ""
    },
    setPlayer : (player) => set({player})    
}));