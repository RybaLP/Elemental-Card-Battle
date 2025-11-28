import { create } from "zustand";
import { GameSession } from "@/types/gameSession";
import { PlayerState } from "@/types/playerState";
import { Card } from "@/types/card";
import { WonRound } from "@/types/wonRound";

interface GameSessionStore {
  session: GameSession | null;
  myPlayer: PlayerState | null;
  enemyPlayer: PlayerState | null;

  selectedCard : Card | null;
  enemySelectedCard : Card | null;

  hasSelectedCard : boolean;

  myWonRounds : WonRound [];
  enemyWonRounds : WonRound [];

  isRevealing : boolean;

  hoveredCard : Card | null;

  isGameOver: () => boolean;

  setSession: (session: GameSession) => void;
  initializePlayers: (myPlayerId: string) => void;
  
  setSelectedCard : (card : Card) => void;
  setEnemyCard : (card : Card) => void;

  resetTurn : () => void;

  setHasSelectedCard : (value : boolean) => void;

  setMyWonRounds : (myWonRounds : WonRound[]) => void;
  setEnemyWonRounds : (enemyWonRounds : WonRound[]) => void;

  setIsRevealing : (value : boolean) => void;

  setHoveredCard : (card : Card | null) => void;

}

export const useGameSessionStore = create<GameSessionStore>((set, get) => ({
  session: null,
  myPlayer: null,
  enemyPlayer: null,
  selectedCard : null,
  enemySelectedCard : null,
  hasSelectedCard : false,
  myWonRounds : [],
  enemyWonRounds : [],
  isRevealing : false,
  hoveredCard : null,

  setSession: (session) => set({ session }),

  initializePlayers: (myPlayerId) => {
    const session = get().session;
    if (!session) return;

    const isPlayer1 = session.player1.playerId === myPlayerId;

    set({
      myPlayer: isPlayer1 ? session.player1 : session.player2,
      enemyPlayer: isPlayer1 ? session.player2 : session.player1
    });
  },

  setSelectedCard : (card : Card) => {
    set({selectedCard : card})
  },

  setEnemyCard : (card : Card) => {
    set({enemySelectedCard : card})
  },

  resetTurn : () => {
    set({selectedCard : null, hasSelectedCard : false, enemySelectedCard : null, isRevealing : false})
  },

  isGameOver: () => get().session?.isOver ?? false,

  setHasSelectedCard : (value : boolean) => set({
    hasSelectedCard : value
  }),

  setMyWonRounds : (rounds) => {
    set({myWonRounds : rounds});
  },

  setEnemyWonRounds : (rounds) => {
    set({enemyWonRounds : rounds})
  },

  setIsRevealing : (value) => {
    set({isRevealing : value})
  },

  setHoveredCard : (value) => set({hoveredCard : value})

}));
