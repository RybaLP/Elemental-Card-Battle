"use client";

import { useGameSessionStore } from "@/store/useGameSessionStore";
import { useRouter } from "next/navigation";
import { useCurrentRoomStore } from "@/store/useCurrentRoomStore";

const GameOver = () => {
  const isGameOver = useGameSessionStore((state) => state.isGameOver);
  const message = useGameSessionStore((state) => state.gameWinnerMessage);
  const currentRoom = useCurrentRoomStore((state) => state.currentRoom);

  const router = useRouter();

  const handleReturnToLobby = () => {
    if (!currentRoom) return;

    router.push(`/play/lobby/${currentRoom.id}`);
  };

  if (!isGameOver) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="min-w-[320px] max-w-[500px] p-10 text-white rounded-3xl shadow-2xl flex flex-col items-center gap-8 border-2 border-red-500/40">
        
        <h2 className="text-5xl font-bold text-transparent bg-clip-text from-red-400 to-pink-400 font-serif tracking-wide">
          Game Over
        </h2>

        <p className="text-2xl text-center text-red-200 font-semibold">
          {message}
        </p>

        <button
          onClick={handleReturnToLobby}
          className="px-10 py-3 text-xl font-bold from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl shadow-lg transition-all transform hover:scale-105"
        >
          Return to Lobby
        </button>
      </div>
    </div>
  );
};

export default GameOver;
