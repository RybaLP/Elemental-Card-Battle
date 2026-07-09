import { Client } from "@stomp/stompjs";

export const sendChatMessage = (client: Client, message: string): void => {
    if (!client.connected) throw new Error("WebSocket not connected");
    if (!message.trim()) throw new Error("Message cannot be empty");

    client.publish({
        destination: "/app/chat/send",
        body: JSON.stringify({ message: message.trim() })
    });
};