export interface ChatMessage {
    senderNickname: string;
    senderId: number;
    message: string;
    timeStamp: number;
    roomId: string;
}