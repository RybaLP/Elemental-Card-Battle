"use client"

import { useGameSessionStore } from "@/store/useGameSessionStore";

const RoundTimer = () => {
  const timer = useGameSessionStore(state => state.timer);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">{timer}</span>
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-20"></div>
      </div>
      <p className="text-white mt-2 text-sm font-medium">Time Left</p>
      <p className="text-gray-400 text-xs">Make your move!</p>
    </div>
  )
}

export default RoundTimer;