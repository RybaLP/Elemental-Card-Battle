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

export const getCurrentRoom = async (): Promise<Room> => {
    const res = await privateClient.get("/rooms/current");
    return res.data;
};

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

export const addBot = async (): Promise<Room> => {
    const res = await privateClient.post("/rooms/add-bot");
    return res.data;
};

export const kickBot = async (): Promise<Room> => {
    const res = await privateClient.post("/rooms/kick-bot");
    return res.data;
};

export const kickPlayer = async (): Promise<Room> => {
    const res = await privateClient.post("/rooms/kick-player");
    return res.data;
};