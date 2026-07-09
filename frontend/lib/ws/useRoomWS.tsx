"use client";

import { useEffect } from "react";
import { Room } from "@/types/room";
import { useStomp } from "./stompContext";

export const useRoomWS = (roomId: string, setRoom: (room: Room) => void) => {
    const { client, connected } = useStomp();

    useEffect(() => {
        if (!client || !connected || !roomId) return;

        const subRoom = client.subscribe(`/topic/room/${roomId}`, (message) => {
            setRoom(JSON.parse(message.body));
        });

        return () => subRoom.unsubscribe();
    }, [client, connected, roomId]);
};