import { Session } from "./session";
import { ChatMessage } from "./chatMessage";

export interface Room {
    id: string;
    name: string;
    isPrivate: boolean;
    isFull: boolean;
    roomOwnerId: number;
    players: Session[];
    messages: ChatMessage[];
}