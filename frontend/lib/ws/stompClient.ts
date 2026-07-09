import { RxStomp } from "@stomp/rx-stomp";
import { getToken } from "@/api/auth";

export const stompClient = new RxStomp();

const brokerURL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";

stompClient.configure({
    brokerURL,
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    connectHeaders: {
        Authorization: `Bearer ${getToken()}`,
    },
});

export const connectWebSocket = () => {
    stompClient.activate();
};

export const disconnectWebSocket = () => {
    stompClient.deactivate();
};