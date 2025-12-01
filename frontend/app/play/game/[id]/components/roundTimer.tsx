"use client";

import { useGameSessionStore } from "@/store/useGameSessionStore";

const RoundTimer = () => {
  
    const timer = useGameSessionStore(state => state.timer);
  
    return (
    <div className="bg-blue-600 text-center p-5 flex justify-center text-2xl text-white">
        <p>{timer}</p>
    </div>
  )
}

export default RoundTimer