import { ChatMessage } from "@/types/chatMessage";
import { getBackendUrl } from "./getBackendUrl";

export const sendMessage = async (roomId: string, playerId: string, nickname: string, message: string): Promise<ChatMessage> => {
    const res = await fetch(`${getBackendUrl()}/chat-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderNickname: nickname, message: message, roomId: roomId, senderId: playerId })
    });

    if (!res.ok) {
        throw new Error(`Failed to send message in room ${roomId} by player ${playerId}. Status: ${res.status}`);
    }

    return res.json();
}