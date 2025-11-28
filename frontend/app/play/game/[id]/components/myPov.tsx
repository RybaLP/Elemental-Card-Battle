"use client";

import { Card } from "@/types/card"
import { selectCard } from "@/api/gameSession";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import HoveredCard from "./hoveredCard";

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
        // find card with provided instanceid
        const hoveredCard = cardsInHand.find((card) => card.instanceId === instanceId);
        if (!hoveredCard) {
            return;
        }
        setHoveredCard(hoveredCard);
    }

    return (
        <div className="fixed left-0 right-0 bottom-0 h-40 bg-gray-900/80 backdrop-blur-md border-t border-gray-600 w-1/2">
            
            {hoveredCard !== null && selectedCard === null && <HoveredCard/>}

            <div className="h-full flex items-end pb-3 pl-24">
                <div className="flex gap-3 overflow-x-auto pr-8 overflow-y-visible">
                    {cardsInHand.map((card) => {
                        return (
                            <div
                                key={card.instanceId}
                                className={`relative transition-all duration-300 ease-out`}
                                onMouseEnter={() => handleSetHoveredCard(card.instanceId)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={()=>handleSelectCard(card)}
                            >
                                <div className="w-28 h-36 rounded-xl cursor-pointer shadow-2xl border-2 border-gray-400 hover:border-purple-400 transition-all duration-300 bg-gray-700">
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
                                
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default MyPov;