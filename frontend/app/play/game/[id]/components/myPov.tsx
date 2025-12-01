"use client";

import { Card } from "@/types/card"
import { selectCard } from "@/api/gameSession";
import { useGameSessionStore } from "@/store/useGameSessionStore";

interface Props {
    cardsInHand: Card[];
    sessionId : string,
    nickname : string
}

const MyPov = ({ cardsInHand , sessionId, nickname}: Props) => {

    const myPlayer = useGameSessionStore(state => state.myPlayer);
    const setSelectedCard = useGameSessionStore(state => state.setSelectedCard);
    const selectedCard = useGameSessionStore(state => state.selectedCard);
    const setHoveredCard = useGameSessionStore(state => state.setHoveredCard);
    const hoveredCard = useGameSessionStore(state => state.hoveredCard);

    const handleSelectCard = async (card: Card) => {
        if (selectedCard != null) return;
        setSelectedCard(card);
        if (!myPlayer) return;
        await selectCard(sessionId,card.instanceId,myPlayer.playerId); 
    }

    const handleSetHoveredCard = (instanceId : string) => {
        const hoveredCard = cardsInHand.find((card) => card.instanceId === instanceId);
        if (!hoveredCard) return;
        setHoveredCard(hoveredCard);
    }

    return (
        <div className="flex flex-col items-end">
            <div className="mb-6 text-center">
                <h3 className="text-white text-2xl font-bold">Your Hand</h3>
            </div>
            
            <div className="grid grid-cols-2 grid-rows-2 gap-6">
                {cardsInHand.map((card, index) => {
                    const isSelected = selectedCard?.instanceId === card.instanceId;
                    return (
                        <div
                            key={card.instanceId}
                            className={`relative transition-all duration-300 ${
                                isSelected ? 'scale-110 -translate-x-6' : 'hover:scale-105 hover:-translate-x-4'
                            }`}
                            onMouseEnter={() => handleSetHoveredCard(card.instanceId)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={()=>handleSelectCard(card)}
                        >
                            <div className={`w-40 h-52 rounded-xl cursor-pointer shadow-2xl border-3 ${
                                isSelected 
                                    ? 'border-purple-400 ring-4 ring-purple-400/50' 
                                    : 'border-gray-600 hover:border-blue-400'
                            } bg-gray-800 overflow-hidden`}>
                                {card.imageUrl ? (
                                    <img 
                                        src={card.imageUrl} 
                                        alt={card.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex flex-col items-center justify-center p-4">
                                        <div className="text-4xl mb-3">🃏</div>
                                        <span className="text-white text-center text-sm font-medium">{card.name}</span>
                                    </div>
                                )}
                                
                                <div className={`absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                                    card.elementalType === 'FIRE' ? 'bg-red-500 border-red-300' :
                                    card.elementalType === 'WATER' ? 'bg-blue-500 border-blue-300' :
                                    'bg-cyan-400 border-cyan-300'
                                }`}>
                                    {card.elementalType === 'FIRE' ? '🔥' : 
                                     card.elementalType === 'WATER' ? '💧' : '❄️'}
                                </div>
                                
                                <div className="absolute bottom-3 right-3 bg-black/80 text-yellow-300 text-base font-bold px-3 py-1.5 rounded-lg">
                                    ⚔️ {card.power || 0}
                                </div>
                            </div>
                            
                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gray-700 border border-gray-500 flex items-center justify-center text-sm text-white font-bold">
                                {index + 1}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-8 text-right">
                <p className="text-gray-400 text-sm">
                    {selectedCard 
                        ? "✓ Card selected - Waiting for opponent" 
                        : "Click a card to select for battle"}
                </p>
            </div>
        </div>
    )
}

export default MyPov;