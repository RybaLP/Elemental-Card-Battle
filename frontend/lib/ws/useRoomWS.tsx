"use client";

import { useEffect } from "react";
import { Room } from "@/types/room";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const useRoomWS = (roomId : string , setRoom : (room : Room) => void) => {
    useEffect(()=>{
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`);
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: () => {},
        });

        stompClient.onConnect = () => {
            stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
                const room : Room = JSON.parse(message.body);
                setRoom(room);
            })
        }
        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    },[roomId, setRoom])
}