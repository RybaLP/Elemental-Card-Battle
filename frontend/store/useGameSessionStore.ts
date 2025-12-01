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

  timer : number;
  showTimer : boolean;

  isGameOver: boolean;

  gameWinnerMessage : string,

  setGameWinnerMessage : (text : string ) => void;

  setIsGameOver : (value : boolean) => void;

  setSession: (session: GameSession) => void;
  initializePlayers: (myPlayerId: string) => void;
  
  setSelectedCard : (card : Card) => void;
  setEnemyCard : (card : Card) => void;

  resetTurn : (cards : Card []) => void;

  setHasSelectedCard : (value : boolean) => void;

  setMyWonRounds : (myWonRounds : WonRound[]) => void;
  setEnemyWonRounds : (enemyWonRounds : WonRound[]) => void;

  setIsRevealing : (value : boolean) => void;

  setHoveredCard : (card : Card | null) => void;

  setTimer : (value : number) => void;
  setShowTimer : (value : boolean) => void;

  refreshCardsInHand : (cards : Card[]) => void;

  clearGameSession : () => void;

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
  timer : 15,
  showTimer : false,
  gameWinnerMessage : "",

  setGameWinnerMessage : (text) => set({gameWinnerMessage : text}),

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

  resetTurn : (cards : Card[]) => {
    const {refreshCardsInHand} = get();
    refreshCardsInHand(cards);
    set({selectedCard : null, hasSelectedCard : false, enemySelectedCard : null, isRevealing : false})
  },

  isGameOver: false,

  setIsGameOver : (value) => set({isGameOver : value}),

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

  setHoveredCard : (value) => set({hoveredCard : value}), 

  setTimer : (value) => set({timer : value}),
  setShowTimer : (value) => set({showTimer : value}),

  refreshCardsInHand : (cards) => {
    const {myPlayer} = get();

    if (!myPlayer) return;

    set({
      myPlayer : {
        ...myPlayer,
        currentHand : cards
      }
    });
  },

  clearGameSession: () => set({
      session: null,
      myPlayer: null,
      enemyPlayer: null,
      selectedCard: null,
      enemySelectedCard: null,
      hasSelectedCard: false,
      myWonRounds: [],
      enemyWonRounds: [],
      isRevealing: false,
      hoveredCard: null,
      timer: 15,
      showTimer: true,
      isGameOver: false,
      gameWinnerMessage: ""
   })
}));