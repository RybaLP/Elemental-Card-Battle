"use client";

import PlayerSlot from "./playerSlot";
import { useCurrentRoomStore } from "@/store/useCurrentRoomStore";
import { useRoomWS } from "@/lib/ws/useRoomWS";
import ChatBox from "./chatBox";
import { leaveRoom, addBot, removeBot } from "@/api/room";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/api/message";
import { startGame } from "@/api/gameSession";
import { useEffect } from "react";
import { useGameSessionStore } from "@/store/useGameSessionStore";

const RoomLobby = () => {

  const {player} = usePlayerStore();
  const {currentRoom, setCurrentRoom } = useCurrentRoomStore();
  const router = useRouter();

  useEffect(() => {
    const { session, isGameOver } = useGameSessionStore.getState();
    if (!session || isGameOver) {
      useGameSessionStore.getState().clearGameSession();
    }
  }, []);

  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-xl">Loading room...</p>
        </div>
      </div>
    );
  } 

  useRoomWS(currentRoom.id, setCurrentRoom);

  const owner = currentRoom.players[0];
  const guest = currentRoom.players[1];
  const isOwner = player.id === owner.id;
  const guestIsBot = guest?.isBot === true;

  const handleLeaveRoom = async () => {
    await sendMessage(currentRoom.id, player.id, player.nickname, `Left the lobby`);
    await leaveRoom(player.id, currentRoom.id);
    router.push("/play/lobby");
  }

  const handleAddBot = async () => {
    try {
      await addBot(currentRoom.id, player.id);
    } catch (error) {
      console.error("Failed to add bot:", error);
    }
  }

  const handleKickBot = async () => {
    try {
      await removeBot(currentRoom.id, player.id);
    } catch (error) {
      console.error("Failed to kick bot:", error);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
            {currentRoom.name}
          </h1>
          <p className="text-gray-400">ID: {currentRoom.id}</p>
          <div className="flex justify-center items-center gap-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {currentRoom.players.length}/2 players
            </div>
            <span>•</span>
            <div>Waiting for player...</div>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          <div className="flex-1 max-w-md">
            <div className="text-center mb-4">
              <span className="text-purple-400 font-semibold text-lg">Owner</span>
            </div>
            {owner && <PlayerSlot player={owner} />}
          </div>

          <div className="flex-1 max-w-2xl">
            <ChatBox />
          </div>

          <div className="flex-1 max-w-md">
            <div className="text-center mb-4">
              <span className="text-blue-400 font-semibold text-lg">Guest</span>
            </div>
            {guest ? (
              <div className="flex flex-col items-center gap-3">
                <PlayerSlot player={guest} />
                {isOwner && guestIsBot && (
                  <button
                    onClick={handleKickBot}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Kick Bot
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-full h-[200px] bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">👤</div>
                    <p>Waiting for player...</p>
                  </div>
                </div>
                {isOwner && (
                  <button
                    onClick={handleAddBot}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Add Bot
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
            <span className="text-white text-sm">
              <button onClick={handleLeaveRoom}>
                Leave room
              </button>
            </span>
          </div>
        </div>

        {isOwner && (
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-4xl"
              onClick={async () => {
                try {
                  const session = await startGame(currentRoom.id);
                  router.push(`/play/game/${session.id}`);
                } catch (error) {
                  console.error("Failed to start game:", error);
                }
              }}
            >
              Start Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomLobby;