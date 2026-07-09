"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PlayerSlot from "./playerSlot";
import ChatBox from "./chatBox";
import { useCurrentRoomStore } from "@/store/useCurrentRoomStore";
import { useRoomWS } from "@/lib/ws/useRoomWS";
import { usePlayerStore } from "@/store/usePlayerStore";
import { leaveRoom, addBot, kickBot, getCurrentRoom } from "@/api/room";
import { startGame } from "@/api/gameSession";
import { getProfile } from "@/api/auth";

const RoomLobby = () => {
  const router = useRouter();
  const { currentRoom, setCurrentRoom } = useCurrentRoomStore();
  const { player, setPlayer } = usePlayerStore();

  const [userId, setUserId] = useState<number | null>(null);
  const [botActionLoading, setBotActionLoading] = useState(false);

  const isLeavingRef = useRef(false);

  useEffect(() => {
    const fetchUserIfNeeded = async () => {
      if (!player || player.id === 0) {
        try {
          const userData = await getProfile();
          setPlayer({
            id: userData.id,
            nickname: userData.username,
            currency: userData.currency,
            gamesWon: userData.gamesWon,
            gamesLost: userData.gamesLost,
          });
        } catch (err) {
          console.error("Nie udało się pobrać profilu użytkownika:", err);
          router.push("/login");
        }
      }
    };
    fetchUserIfNeeded();
  }, [player?.id, setPlayer, router]);

  useEffect(() => {
    if (!currentRoom && !isLeavingRef.current) {
      const restoreRoomSession = async () => {
        try {
          const roomData = await getCurrentRoom();
          if (roomData) {
            setCurrentRoom(roomData);
          } else {
            router.push("/play/lobby");
          }
        } catch (error) {
          console.error("Failed to restore room session:", error);
          router.push("/play/lobby");
        }
      };
      restoreRoomSession();
    }
  }, [currentRoom, setCurrentRoom, router]);

  useEffect(() => {
    if (player && player.id !== 0) {
      setUserId(player.id);
    }
  }, [player]);

  useRoomWS(currentRoom?.id ?? "", setCurrentRoom);

  if (!currentRoom || !player || player.id === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-xl">Loading room...</p>
        </div>
      </div>
    );
  }

  const owner = currentRoom.players[0];
  const guest = currentRoom.players[1];

  const isOwner = userId !== null && currentRoom.roomOwnerId === userId;
  const guestIsBot = guest ? (guest.userId !== null && guest.userId < 0) : false;
  const roomIsFull = currentRoom.players.length >= 2;

  const handleLeaveRoom = async () => {
    try {
      isLeavingRef.current = true;
      await leaveRoom();
      setCurrentRoom(null);
      router.push("/play/lobby");
    } catch (error) {
      console.error("Failed to leave room:", error);
      isLeavingRef.current = false;
    }
  };

  const handleAddBot = async () => {
    if (botActionLoading) return;
    setBotActionLoading(true);
    try {
      const updatedRoom = await addBot(currentRoom.id);
      setCurrentRoom(updatedRoom);
    } catch (error) {
      console.error("Failed to add bot:", error);
    } finally {
      setBotActionLoading(false);
    }
  };

  const handleKickBot = async () => {
    if (botActionLoading || !guest || !guestIsBot || guest.userId === null) return;
    setBotActionLoading(true);
    try {
      const updatedRoom = await kickBot(currentRoom.id, guest.userId);
      setCurrentRoom(updatedRoom);
    } catch (error) {
      console.error("Failed to kick bot:", error);
    } finally {
      setBotActionLoading(false);
    }
  };

  const handleStartGame = async () => {
    try {
      const session = await startGame(currentRoom.id);
      router.push(`/play/game/${session.id}`);
    } catch (error) {
      console.error("Failed to start game:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
            {currentRoom.name}
          </h1>
          <p className="text-gray-400 text-xs">ID: {currentRoom.id}</p>
          <div className="flex justify-center items-center gap-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {currentRoom.players.length}/2 players
            </div>
            <span>•</span>
            <div>{roomIsFull ? "Ready to battle!" : "Waiting for player..."}</div>
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
                    disabled={botActionLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm
                               transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {botActionLoading ? "Removing…" : "Kick Bot"}
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
                    disabled={botActionLoading}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm
                               transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {botActionLoading ? "Adding…" : "Add Bot"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={handleLeaveRoom}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full text-sm transition-colors cursor-pointer"
          >
            Leave room
          </button>

          {isOwner && roomIsFull && (
            <button
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
              onClick={handleStartGame}
            >
              Start Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomLobby;