import { Card } from "./card";
import { WonRound } from "./wonRound";

export interface PlayerState {
  userId: number;               
  nickname: string;
  currentHand: Card[];
  wonRounds: WonRound[];
  hasPlayedThisTurn: boolean;
  selectedCard: Card | null;
}