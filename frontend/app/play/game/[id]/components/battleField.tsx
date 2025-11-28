"use client"

import { useGameSessionStore } from "@/store/useGameSessionStore";


const BattleField = () => {

  const enemySelectedCard = useGameSessionStore(state => state.enemySelectedCard);
  const selectedCard = useGameSessionStore(state => state.selectedCard);
  const isRevealing = useGameSessionStore(state => state.isRevealing);

  return (

    <div className="w-full">
      
      <div className="w-1/2 flex items-center justify-center">
        {selectedCard && (
        <div>
          <img src={selectedCard.imageUrl} alt={selectedCard.name} width={500}/>
        </div>
        )}
      </div>

        <div className="w-1/2 flex items-center justify-center">
        {enemySelectedCard && (

        isRevealing ? (
        <div>
          <img src={enemySelectedCard.imageUrl} alt={enemySelectedCard.name} width={500} />
        </div>
        ) : (
        <div>
          <img src={"/back-card.png"} alt="" />
        </div>
        )
      )}

      </div>

      

    </div>
  )
}

export default BattleField