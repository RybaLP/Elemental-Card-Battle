import { ChatMessage } from "@/types/chatMessage";

export const sendMessage = async (roomId : string, playerId : string, nickname : string, message : string) : Promise<ChatMessage> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat-message`,{
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({senderNickname : nickname, message : message, roomId : roomId, senderId : playerId}
    )})

    if (!res.ok) {
        throw new Error("Could not send message");
    }

    const chatMessage = await res.json();
    return chatMessage;
}