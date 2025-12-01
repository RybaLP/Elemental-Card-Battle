"use client"

import { useGameSessionStore } from "@/store/useGameSessionStore";

const BattleField = () => {
  const enemySelectedCard = useGameSessionStore(state => state.enemySelectedCard);
  const selectedCard = useGameSessionStore(state => state.selectedCard);
  const isRevealing = useGameSessionStore(state => state.isRevealing);

  return (
    <div className="w-full max-w-6xl mx-auto">

      <div className="flex items-center justify-center gap-24">

        <div>
          {selectedCard ? (
            <div className="relative w-72 h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-400">
              <img 
                src={selectedCard.imageUrl} 
                alt={selectedCard.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                <h3 className="text-white text-lg font-bold">{selectedCard.name}</h3>
              </div>
            </div>
          ) : (
            <div className="w-72 h-96 rounded-2xl border-4 border-dashed border-blue-300/50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/30 to-gray-900/30">
              <div className="text-blue-300 text-5xl mb-4">🃏</div>
              <p className="text-blue-200 text-lg">Select a card</p>
            </div>
          )}
        </div>
        
        <div>
          {enemySelectedCard ? (
            <div className="relative w-72 h-96">
              {isRevealing ? (
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-red-400">
                  <img 
                    src={enemySelectedCard.imageUrl} 
                    alt={enemySelectedCard.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    <h3 className="text-white text-lg font-bold">{enemySelectedCard.name}</h3>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full relative">
                  <img 
                    src={"/back-card.png"} 
                    alt="Hidden Card" 
                    className="w-full h-full object-cover rounded-2xl border-4 border-yellow-400"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center bg-black/50 px-4 py-3 rounded-lg">
                      <p className="text-white font-bold">HIDDEN</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-72 h-96 rounded-2xl border-4 border-dashed border-red-300/50 flex flex-col items-center justify-center bg-gradient-to-br from-red-900/30 to-gray-900/30">
              <div className="text-red-300 text-5xl mb-4">👤</div>
              <p className="text-red-200 text-lg">Enemy Thinking</p>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

export default BattleField