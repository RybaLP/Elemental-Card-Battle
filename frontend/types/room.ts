import { Player } from "./player";

export interface Room {
    id : string ,
    name : string , 
    isPrivate : boolean,
    isFull : boolean,
    roomOwnerId : string,
    players : Player[]
}