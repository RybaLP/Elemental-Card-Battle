import { Session } from "./session";

export interface Room {
    id : string ,
    name : string , 
    isPrivate : boolean,
    isFull : boolean,
    roomOwnerId : number,
    players : Session[]
}