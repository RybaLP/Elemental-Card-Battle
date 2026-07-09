"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCurrentRoomStore } from "@/store/useCurrentRoomStore";
import { ChatMessage } from "@/types/chatMessage";
import { useStomp } from "@/lib/ws/stompContext";
import useChatMessageWS from "@/lib/ws/useChatMessageWS";
import { sendChatMessage } from "@/api/message";
import { getUserIdFromToken } from "@/api/auth";

const ChatBox = () => {
    const { currentRoom } = useCurrentRoomStore();
    const { client } = useStomp();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const userId = getUserIdFromToken();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useChatMessageWS(currentRoom?.id ?? "", (message: ChatMessage) => {
        setMessages(prev => [...prev, message]);
    });

    if (!currentRoom) return null;

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!currentMessage.trim() || loading || !client) return;

        setLoading(true);
        try {
            sendChatMessage(client, currentMessage);
            setCurrentMessage("");
            inputRef.current?.focus();
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#13132a]/80 border border-purple-500/20 rounded-2xl shadow-lg h-80 flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 shrink-0 flex items-center justify-between">
                <h3 className="text-white font-semibold text-sm">Room Chat</h3>
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-green-400 text-xs">{currentRoom.players.length}/2</span>
                </div>
            </div>

            {/* Messages */}
            <div className="overflow-y-auto p-4 flex-1 space-y-2">
                {messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-600 text-sm">
                        No messages yet
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isOwn = message.senderId === userId;
                        return (
                            <div key={index} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                                    isOwn ? "bg-purple-600 text-white" : "bg-white/10 text-white"
                                }`}>
                                    {!isOwn && (
                                        <p className="text-xs text-purple-300 font-medium mb-0.5">
                                            {message.senderNickname}
                                        </p>
                                    )}
                                    <p className="break-words">{message.message}</p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 shrink-0 flex gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Send a message..."
                    disabled={loading}
                    maxLength={200}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg
                               text-white placeholder-gray-600 text-sm
                               focus:outline-none focus:border-purple-500/60 transition-colors
                               disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!currentMessage.trim() || loading}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm
                               rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatBox;