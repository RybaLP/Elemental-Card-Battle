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

  if (!session) return <div>Session not found</div>;

  if (!myPlayer?.currentHand) return <div>Loading your hand...</div>;

  
  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">

      { isGameOver && <GameOver/> }


      <MyPov
        cardsInHand={myPlayer.currentHand}
        sessionId={session.id}
        nickname={player.nickname}
      />

      {showTimer &&  <RoundTimer/>}

        <div className="absolute top-4 left-4">
          <WonRounds wonRounds={myWonRounds} />
        </div>

          <BattleField />

        <div className="absolute top-4 right-4">
          <WonRounds wonRounds={enemyWonRounds} />
        </div>

      <Enemy />
    </div>
  );
};

export default Page;