"use client";

import { useEffect } from "react";
import { ChatMessage } from "@/types/chatMessage";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const useChatMessageWS = ( roomId : string , setMessages : ( message : ChatMessage ) => void ) => {
    useEffect(() => {
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`);
         
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: () => {}
        });

        stompClient.onConnect = () => {
            stompClient.subscribe(`/topic/room/${roomId}/messages` , (m) => {
                const message : ChatMessage = JSON.parse(m.body);
                setMessages(message);
            })
        }

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        }

    } , [setMessages])
}

export default useChatMessageWS;