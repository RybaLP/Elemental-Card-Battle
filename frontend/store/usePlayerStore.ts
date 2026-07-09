import { create } from "zustand";
import { Player } from "@/types/player";

interface PlayerStore {
    player: Player;
    setPlayer: (player: Player) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
    player: {
        id: 0,
        nickname: "",
        currency: 0,
        gamesWon: 0,
        gamesLost: 0
    },
    setPlayer: (player) => set({ player }),
}));