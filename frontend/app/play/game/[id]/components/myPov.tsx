"use client";

import { Card } from "@/types/card";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import { usePlayCard } from "@/lib/hooks/usePlayCard";

interface Props {
  cardsInHand: Card[];
  sessionId: string;
}

const MyPov = ({ cardsInHand, sessionId }: Props) => {
  const myPlayer = useGameSessionStore((state) => state.myPlayer);
  const setSelectedCard = useGameSessionStore((state) => state.setSelectedCard);
  const selectedCard = useGameSessionStore((state) => state.selectedCard);
  const setHoveredCard = useGameSessionStore((state) => state.setHoveredCard);
  const playCard = usePlayCard();

  const handleSelectCard = (card: Card) => {
    if (selectedCard != null) return;
    setSelectedCard(card);
    if (!myPlayer) return;

    const audio = new Audio("/audio/select-card-sound.mp3");
    audio.volume = 0.5;
    audio.play();

    playCard(sessionId, card.instanceId); 
  };

  const handleSetHoveredCard = (instanceId: number) => {
    const hoveredCard = cardsInHand.find((card) => card.instanceId === instanceId);
    if (!hoveredCard) return;
    setHoveredCard(hoveredCard);
  };

  return (
    <div className="flex flex-col items-end">

      <div className="grid grid-cols-2 grid-rows-2 gap-6">
        {cardsInHand.map((card, index) => {
          const isSelected = selectedCard?.instanceId === card.instanceId;
          return (
            <div
              key={card.instanceId}
              className={`relative transition-all duration-300 ${
                isSelected ? "scale-110 -translate-x-6" : "hover:scale-105 hover:-translate-x-4"
              }`}
              onMouseEnter={() => handleSetHoveredCard(card.instanceId)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleSelectCard(card)}
            >
              <div
                className={`w-40 h-52 rounded-xl cursor-pointer shadow-2xl border-3 ${
                  isSelected
                    ? "border-purple-400 ring-4 ring-purple-400/50"
                    : "border-gray-600 hover:border-blue-400"
                } bg-gray-800 overflow-hidden`}
              >
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-800 flex flex-col items-center justify-center p-4">
                    <div className="text-4xl mb-3">🃏</div>
                    <span className="text-white text-center text-sm font-medium">{card.name}</span>
                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default MyPov;