"use client";

import { useState } from "react";
import { createPlayer } from "@/api/player";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useRouter } from "next/navigation";

export const NicknameForm = () => {
  
  const [nickname, setNickname] = useState("");
  const {setPlayer} = usePlayerStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) return; 

    try {
      const response = await createPlayer(nickname);

      if (response.nickname && response.id) {
        setPlayer({id: response.id, nickname: response.nickname});
        router.push("/play/lobby");
      }

    } catch (error) {
       throw new Error("Failed to create player");
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-purple-500/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
            Enter your nickname
          </h1>
          <p className="text-gray-400 text-sm">
           Begin your adventure with a unique name
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="nickname" className="text-gray-300 text-sm font-medium">
              Your nickname
            </label>
            <input 
              id="nickname"
              type="text"
              name="nickname"
              placeholder="Wprowadź swój nick..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                       text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                       focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              autoComplete="off"
              maxLength={20}
            />
          </div>

          <button 
            type="submit"
            disabled={!nickname.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 
                     hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 
                     disabled:to-gray-700 disabled:cursor-not-allowed text-white 
                     font-semibold py-3 px-4 rounded-lg transition-all duration-200 
                     transform hover:scale-[1.02] active:scale-[0.98] 
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {nickname.trim() ? `Graj jako ${nickname}` : 'Wprowadź nick'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default NicknameForm;