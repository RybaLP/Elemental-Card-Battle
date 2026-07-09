"use client";

import { useEffect } from "react";
import { Room } from "@/types/room";
import { useStomp } from "./stompContext";

const useRoomsWS = (setRooms: (rooms: Room[]) => void) => {
    const { client, connected } = useStomp();

    useEffect(() => {
        if (!client || !connected) return;

        const sub = client.subscribe("/topic/rooms", (message) => {
            setRooms(JSON.parse(message.body));
        });

        return () => sub.unsubscribe();
    }, [client, connected, setRooms]);
};

export default useRoomsWS
