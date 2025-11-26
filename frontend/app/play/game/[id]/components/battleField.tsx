"use client"

import { useGameSessionStore } from "@/store/useGameSessionStore";
import { useEffect } from "react";


const BattleField = () => {

  const enemySelectedCard = useGameSessionStore(state => state.enemySelectedCard);
  const selectedCard = useGameSessionStore(state => state.selectedCard);
  const isRevealing = useGameSessionStore(state => state.isRevealing);

  return (

    <div className="flex flex-row">
      {selectedCard && (
        <div>
          <img src={selectedCard.imageUrl} alt={selectedCard.name}/>
        </div>
      )}

      {enemySelectedCard && (

        isRevealing ? (
        <div>
          <img src={enemySelectedCard.imageUrl} alt={enemySelectedCard.name} />
        </div>
        ) : (
        <div>
          <img src={"/back-card.png"} alt="" />
        </div>
        )
      )}

    </div>
  )
}

export default BattleField