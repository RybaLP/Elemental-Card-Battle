"use client";

import { useGameSessionStore } from "@/store/useGameSessionStore";
import { useRouter } from "next/navigation";
import { useCurrentRoomStore } from "@/store/useCurrentRoomStore";
import { useState, useEffect } from "react";

const GameOver = () => {
  const isGameOver = useGameSessionStore((state) => state.isGameOver);
  const message = useGameSessionStore((state) => state.gameWinnerMessage);
  const currentRoom = useCurrentRoomStore((state) => state.currentRoom);
  const setCurrentRoom = useCurrentRoomStore((state) => state.setCurrentRoom);
  const resetTurn = useGameSessionStore((state) => state.resetTurn);
  const router = useRouter();
  const myPlayer = useGameSessionStore((state) => state.myPlayer);

  const [showResult, setShowResult] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (isGameOver) {
      const resultTimer = setTimeout(() => {
        setShowResult(true);
      }, 2000);

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(resultTimer);
        clearInterval(countdownInterval);
      };
    } else {
      setShowResult(false);
      setCountdown(5);
    }
  }, [isGameOver]);

  useEffect(() => {
    if (showResult && countdown === 0) {
      const redirectTimer = setTimeout(() => {
        router.push("/play/lobby");
      }, 500);

      return () => clearTimeout(redirectTimer);
    }
  }, [showResult, countdown, router]);

  const handleReturnToLobby = async () => {
    if (!currentRoom) return;
    if (!myPlayer) return;
    setCurrentRoom(null);
    resetTurn(myPlayer.currentHand);
    router.push("/play/lobby");
  };

  if (!isGameOver) return null;

  const isWinner = message?.toLowerCase().includes("you win") || false;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fadeIn">
      <div className={`min-w-[320px] max-w-[500px] p-10 text-white rounded-3xl shadow-2xl flex flex-col items-center gap-8 border-2 ${
        isWinner ? "border-green-500/40" : "border-red-500/40"
      }`}>
        <h2 className={`text-5xl font-bold font-serif tracking-wide transition-all duration-700 delay-200 transform ${
          showResult ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        } ${
          isWinner ? "text-green-400" : "text-red-400"
        }`}>
          {isWinner ? "Victory!" : "Defeat!"}
        </h2>

        <div className={`transition-all duration-700 delay-500 transform ${
          showResult ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}>
          <p className="text-2xl text-center font-semibold">
            {isWinner ? "You Win!" : "You Lose"}
          </p>
          <p className="text-lg text-center text-gray-300 mt-2">{message}</p>
        </div>

        <div className={`transition-all duration-700 delay-700 transform ${
          showResult ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        } w-full flex flex-col items-center gap-4`}>
          <button
            onClick={handleReturnToLobby}
            className={`w-full px-10 py-3 text-xl font-bold text-white rounded-xl shadow-lg transition-all transform hover:scale-105 ${
              isWinner
                ? "bg-green-600 hover:bg-green-500"
                : "bg-purple-600 hover:bg-purple-500"
            }`}
          >
            Return to Lobby {countdown > 0 && `(${countdown}s)`}
          </button>

          <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                isWinner ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${(countdown / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOver;