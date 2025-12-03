import {create} from "zustand";

interface AudioStore {
    playResolveRound : boolean,
    setPlayResolveRound : (value : boolean) => void;

    playEnemySelectedCard : boolean,
    setPlayEnemySelectedCard : (value : boolean) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
    playResolveRound : false,
    setPlayResolveRound : (value) => set({playResolveRound : value}),
    
    playEnemySelectedCard : false,
    setPlayEnemySelectedCard : (value) => set({playEnemySelectedCard : value})
}));