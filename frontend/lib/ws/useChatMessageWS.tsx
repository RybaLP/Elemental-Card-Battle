"use client";

import { useEffect } from "react";
import { ChatMessage } from "@/types/chatMessage";
import { useStomp } from "./stompContext";

const useChatMessageWS = (roomId: string, setMessages: (message: ChatMessage) => void) => {
    const { client, connected } = useStomp();

    useEffect(() => {
        if (!client || !connected || !roomId) return;

        const sub = client.subscribe(`/topic/room/${roomId}/chat`, (m) => { 
            setMessages(JSON.parse(m.body));
        });

        return () => sub.unsubscribe();
    }, [client, connected, roomId]);
};

export default useChatMessageWS;