import { Room } from "@/types/room";
import { getBackendUrl } from "./getBackendUrl";

export const fetchRooms = async (): Promise<Room[]> => {
    const res = await fetch(`${getBackendUrl()}/rooms`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error(`Failed to fetch rooms. Status: ${res.status}`);
    return res.json();
}

export const createPublicRoom = async (name: string, playerId: string): Promise<Room> => {
    const res = await fetch(`${getBackendUrl()}/rooms/create-public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, playerId })
    });
    if (!res.ok) throw new Error(`Failed to create room "${name}" for player ${playerId}. Status: ${res.status}`);
    return res.json();
}

export const getRoomById = async (roomId: string): Promise<Room> => {
    const res = await fetch(`${getBackendUrl()}/rooms/${roomId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error(`Failed to fetch room ${roomId}. Status: ${res.status}`);
    return res.json();
}

export const joinPublicRoom = async (playerId: string, roomId: string): Promise<Room> => {
    const res = await fetch(`${getBackendUrl()}/rooms/join-public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, roomId })
    });
    if (!res.ok) throw new Error(`Failed to join room ${roomId} for player ${playerId}. Status: ${res.status}`);
    return res.json();
}

export const leaveRoom = async (playerId: string, roomId: string): Promise<void> => {
    const res = await fetch(`${getBackendUrl()}/rooms/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, roomId })
    });
    if (!res.ok) throw new Error(`Failed to leave room ${roomId} for player ${playerId}. Status: ${res.status}`);
}

export const addBot = async (roomId : string , ownerId : string ) : Promise <Room> => {
    const res = await fetch(`${getBackendUrl()}/rooms/add-bot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, ownerId })
    });
    if (!res.ok) throw new Error(`Failed to add bot to room ${roomId}. Status: ${res.status}`);
    return res.json();
}

export const removeBot = async (roomId : string , ownerId : string ) : Promise<Room> => {
    const res = await fetch(`${getBackendUrl()}/rooms/kick-bot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, ownerId })
    });
    if (!res.ok) throw new Error(`Failed to remove bot from room ${roomId}. Status: ${res.status}`);
    return res.json();
}

export const leaveRoomAndDelete = async (playerId: string, roomId: string): Promise<void> => {
    const res = await fetch(`${getBackendUrl()}/rooms/leave-and-delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, roomId })
    });
    if (!res.ok) throw new Error(`Failed to leave and delete room ${roomId} for player ${playerId}. Status: ${res.status}`);
}