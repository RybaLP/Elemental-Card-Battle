"use client";

import { useEffect } from "react";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import { usePlayerStore } from "@/store/usePlayerStore";

import MyPov from "./components/myPov";
import BattleField from "./components/battleField";
import Enemy from "./components/enemy";
import { useGameSessionWS } from "@/lib/ws/useGameSessionWS";

import WonRounds from "./components/wonRounds";
import RoundTimer from "./components/roundTimer";
import GameOver from "./components/gameOver";
import AudioPlayer from "./components/audioPlayer";
import PlayResolveRound from "@/helper/playResolveRound";
import PlayEnemySelectedCard from "@/helper/playEnemySelectedCard";

const Page = () => {
  const session = useGameSessionStore((state) => state.session);
  const initializePlayers = useGameSessionStore((state) => state.initializePlayers);
  const myPlayer = useGameSessionStore((state) => state.myPlayer);
  const myWonRounds = useGameSessionStore(state => state.myWonRounds);
  const enemyWonRounds = useGameSessionStore(state => state.enemyWonRounds);
  const isGameOver = useGameSessionStore(state => state.isGameOver);
  const player = usePlayerStore((state) => state.player);
  const showTimer = useGameSessionStore(state => state.showTimer);

  useGameSessionWS(session?.id ?? "", player?.id ?? "");

  useEffect(() => {
    if (!session || !player) return;
    initializePlayers(player.id);
  }, [session, player, initializePlayers]);

  if (!session) return <div className="flex items-center justify-center h-screen text-white">Session not found</div>;

  if (!myPlayer?.currentHand) return <div className="flex items-center justify-center h-screen text-white">Loading your hand...</div>;

  
  return (
    
    <div className="relative w-full h-screen bg-linear-to-b from-gray-900 via-blue-950 to-gray-900 overflow-hidden min-w-4xl">
      
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* it is an invisible component - plays sound whenever state turns to true */}
      <PlayResolveRound/>
      <PlayEnemySelectedCard/>

      {isGameOver && <GameOver />}

      {showTimer && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30">
          <RoundTimer />
        </div>
      )}
      
      <AudioPlayer/>

      <div className="absolute top-4 left-0 right-0 flex justify-between px-8 z-10">
        <div className="flex flex-col items-start">
          <h3 className="text-white text-lg font-bold mb-2">Your Rounds</h3>
          <WonRounds wonRounds={myWonRounds} />
        </div>

        <div className="flex flex-col items-end">
          <h3 className="text-white text-lg font-bold mb-2">Enemy Rounds</h3>
          <WonRounds wonRounds={enemyWonRounds} />
        </div>
      </div>

      <div className="flex h-full pt-24 w-full max-w-[1920px] mx-auto">
        
        <div className="w-1/4 flex items-center justify-end pr-12">
          <MyPov
            cardsInHand={myPlayer.currentHand}
            sessionId={session.id}
          />
        </div>

        <div className="w-2/4 flex items-center justify-center">
          <BattleField />
        </div>

        <div className="w-1/4 flex items-center justify-start pl-12">
          <Enemy />
        </div>

      </div>
    </div>
  );
};

export default Page;