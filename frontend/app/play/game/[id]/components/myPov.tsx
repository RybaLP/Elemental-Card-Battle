"use client";

import { Card } from "@/types/card"
import { useState } from "react"
import { selectCard } from "@/api/gameSession";
import { useGameSessionStore } from "@/store/useGameSessionStore";

interface Props {
    cardsInHand: Card[];
    playerId : string,
    sessionId : string,
    nickname : string
}

const MyPov = ({ cardsInHand , playerId, sessionId, nickname}: Props) => {

    const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
    const myPlayer = useGameSessionStore(state => state.myPlayer);
    const setSelectedCard = useGameSessionStore(state => state.setSelectedCard);

    const handleSelectCard = async (card: Card) => {
    setSelectedCard(card);
    if (!myPlayer) return;
    await selectCard(sessionId, playerId, card.id); 
}

    return (
        <div className="fixed left-0 right-0 bottom-0 h-40 bg-gray-900/80 backdrop-blur-md border-t border-gray-600 w-1/2">
            <div className="absolute -top-16 left-4 bg-gray-800/90 rounded-xl border border-gray-600 p-3 w-48">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        Y
                    </div>
                    <div className="flex-1">
                        {/* nickname */}
                        <p className="text-white font-semibold text-sm truncate">{nickname}</p>
                    </div>
                </div>
            </div>

            <div className="h-full flex items-end pb-3 pl-24">
                <div className="flex gap-3 overflow-x-auto pr-8">
                    {cardsInHand.map((card,index) => {
                        const isHovered = hoveredCard?.id === card.id;
                        return (
                            <div
                                key={index}
                                className={`relative transition-all duration-300 ease-out ${
                                    isHovered ? 'transform -translate-y-6 scale-110 z-50' : 'z-0'
                                }`}
                                style={{ 
                                    marginLeft: isHovered ? '0' : '0',
                                }}
                                onMouseEnter={() => setHoveredCard(card)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={()=>handleSelectCard(card)}
                            >
                                <div className="w-28 h-36 rounded-xl overflow-hidden cursor-pointer shadow-2xl border-2 border-gray-400 hover:border-purple-400 transition-all duration-300 bg-gray-700">
                                    {card.imageUrl ? (
                                        <img 
                                            src={card.imageUrl} 
                                            alt={card.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-gray-300 text-xl">
                                            🃏
                                        </div>
                                    )}
                                </div>
                                
                                {isHovered && (
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-3 mb-3 bg-gray-800 border-2 border-purple-500 rounded-xl p-3 shadow-2xl z-50 min-w-[140px]">
                                        <p className="text-white font-bold text-sm text-center truncate mb-1">
                                            {card.name}
                                        </p>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-300">Power:</span>
                                            <span className="text-white font-semibold">{card.power}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default MyPov;