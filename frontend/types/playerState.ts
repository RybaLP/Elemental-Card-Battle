import { Card } from "./card";
import { WonRound } from "./wonRound";

export interface PlayerState {
    playerId : string;
    currentHand : Card[];
    wonCards : Card[];
    wonRounds : WonRound[],
    hasPlayedThisTurn : boolean,
    selectedCard : Card[]
}