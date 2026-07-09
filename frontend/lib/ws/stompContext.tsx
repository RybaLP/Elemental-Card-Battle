"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getToken } from "@/api/auth";

interface StompContextType {
    client: Client | null;
    connected: boolean;
}

const StompContext = createContext<StompContextType>({ client: null, connected: false });

export const StompProvider = ({ children }: { children: React.ReactNode }) => {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const token = getToken();
        if (!token) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`),
            reconnectDelay: 5000,
            debug: () => {},
            connectHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        client.onConnect = () => setConnected(true);
        client.onDisconnect = () => setConnected(false);

        client.activate();
        setStompClient(client);

        return () => { client.deactivate(); };
    }, []);

    return (
        <StompContext.Provider value={{ client: stompClient, connected }}>
            {children}
        </StompContext.Provider>
    );
};

export const useStomp = () => useContext(StompContext);