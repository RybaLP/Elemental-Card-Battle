"use client";

import React, { useState, useRef, useEffect } from "react";
import useChatMessageWS from "@/lib/ws/useChatMessageWS";
import { useCurrentRoomStore } from "@/store/useCurrentRoomStore";
import { ChatMessage } from "@/types/chatMessage";
import { usePlayerStore } from "@/store/usePlayerStore";
import { sendMessage } from "@/api/message";
const ChatBox = () => {
  const { currentRoom } = useCurrentRoomStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const { player } = usePlayerStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  if (!currentRoom) {
    return (
      <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading room...</p>
      </div>
    );
  }
  useChatMessageWS(currentRoom.id, (newMessage: ChatMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  });
  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    await sendMessage(
      currentRoom.id,
      player.id,
      player.nickname,
      currentMessage
    );
    setCurrentMessage("");
    inputRef.current?.focus();
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-700 bg-gray-800 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-xl">ROOM CHAT</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-green-400 text-sm font-medium">
              {currentRoom.players.length}/2
            </span>
          </div>
        </div>
      </div>
      <div
        ref={messagesContainerRef}
        className="overflow-y-auto bg-gray-900 p-6 flex-none"
        style={{ height: "400px" }}
      >
        {messages.length === 0 ? (
          <div className="text-center py-16 text-gray-500 h-full flex flex-col items-center justify-center">
            <div className="text-3xl mb-3">🎮</div>
            <p className="font-medium text-lg">No messages</p>
            <p className="text-sm mt-2">Be the first to write something!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId === player.id;
              return (
                <div
                  key={index}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  } group`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 transition-all duration-200 ${
                      isOwnMessage
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-white"
                    } hover:bg-opacity-90`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`text-sm font-bold ${
                          isOwnMessage ? "text-purple-200" : "text-blue-300"
                        }`}
                      >
                        {message.senderNickname}
                      </span>
                    </div>

                    <div className="text-sm leading-relaxed wrap-break-word">
                      {message.message}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700 bg-gray-800 shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send a message..."
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg
                     text-white placeholder-gray-400 focus:outline-none focus:border-purple-500
                     transition-all duration-200"
            maxLength={200}
            autoFocus
          />

          <button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600
                     disabled:cursor-not-allowed text-white font-semibold rounded-lg
                     transition-all duration-200 min-w-20"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatBox;
