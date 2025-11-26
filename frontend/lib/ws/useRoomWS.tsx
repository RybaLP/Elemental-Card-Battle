"use client";

import { useEffect } from "react";
import { Room } from "@/types/room";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useRouter } from "next/navigation";
import { useGameSessionStore } from "@/store/useGameSessionStore";

export const useRoomWS = (roomId : string , setRoom : (room : Room) => void) => {
    
    const router = useRouter();
    const {setSession} = useGameSessionStore();

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

            stompClient.subscribe(`/topic/game/${roomId}`, (message) => {
                const body = JSON.parse(message.body);
                if (body.event === "gameStart" && body.sessionId) {
                    setSession(body.session)
                    router.push(`/play/game/${body.sessionId}`)
                }
            })
        }
        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    },[roomId, setRoom])
}