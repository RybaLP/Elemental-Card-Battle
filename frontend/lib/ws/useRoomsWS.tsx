"use client";

import { useEffect } from "react";
import { Room } from "@/types/room";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const useRoomsWS = (setRooms : (rooms : Room[]) => void) => {
  
    useEffect (()=>{
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`);

         const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: () => {}
        });

        stompClient.onConnect = () => {
            stompClient.subscribe("/topic/rooms", (message) => {
                const rooms : Room [] = JSON.parse(message.body);
                setRooms(rooms);
            });
        };

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        }
    },[setRooms]);
}

export default useRoomsWS
