import privateClient from "./client/privateClient";
import { Room } from "@/types/room";

export const fetchRooms = async (): Promise<Room[]> => {
    const res = await privateClient.get("/rooms");
    return res.data;
};

export const createPublicRoom = async (name: string): Promise<Room> => {
    const res = await privateClient.post("/rooms/create-public", { name });
    return res.data;
};

export const createPrivateRoom = async (name: string, password: string): Promise<Room> => {
    const res = await privateClient.post("/rooms/create-private", { name, password });
    return res.data;
};

export const getCurrentRoom = async () : Promise<Room> => {
    const res = await privateClient.get("/rooms/current");
    return res.data;
}

export const getRoomById = async (roomId: string): Promise<Room> => {
    const res = await privateClient.get(`/rooms/${roomId}`);
    return res.data;
};

export const joinRoom = async (roomId: string, password?: string): Promise<Room> => {
    const res = await privateClient.post("/rooms/join", { roomId, password });
    return res.data;
};

export const leaveRoom = async (): Promise<void> => {
    await privateClient.post("/rooms/leave");
};

export const addBot = async (roomId: string): Promise<Room> => {
    const res = await privateClient.post("/rooms/add-bot", { roomId });
    return res.data;
};

export const kickBot = async (roomId: string, botId: number | null): Promise<Room> => {
    const res = await privateClient.post(`/rooms/${roomId}/kick-bot`, { botId });
    return res.data;
};