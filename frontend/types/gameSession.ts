import { PlayerState } from "./playerState";

export interface GameSession {
  id: string;
  player1: PlayerState;
  player2: PlayerState;
  roomId: string;
  winnerId?: number;
  turnNumber: number;
  isOver: boolean;
  timerActive: boolean;
}