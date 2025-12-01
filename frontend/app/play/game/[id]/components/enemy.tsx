"use client";

import Image from "next/image";
import { useGameSessionStore } from "@/store/useGameSessionStore";

const Enemy = () => {
    const enemyHandSize = useGameSessionStore(state => state.enemyPlayer?.currentHand?.length || 4);
    const cards = Array.from({ length: enemyHandSize });

    return (
        <div className="flex flex-col items-start">
            <div className="mb-6 text-center w-full">
                <h3 className="text-white text-2xl font-bold">Enemy Hand</h3>
            </div>
            
            <div className="grid grid-cols-2 grid-rows-2 gap-6">
                {cards.map((_, index) => (
                    <div
                        key={index}
                        className="relative transition-transform duration-300 hover:scale-105"
                    >
                        <div className="w-40 h-52 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-600 bg-gradient-to-br from-red-900/80 to-gray-900/80 relative">
                            <Image 
                                src="/back-card.png"
                                alt="Hidden Card"
                                fill 
                                className="object-cover"
                            />
                            
                            <div className="absolute inset-0 bg-black/20"></div>
                        </div>
                        
                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-600 border-2 border-red-400 flex items-center justify-center text-sm font-bold text-white shadow-lg z-10">
                            {index + 1}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 text-left w-full pl-2">
                <span className="text-gray-400 text-sm font-medium">
                    {enemyHandSize > 0 ? `${enemyHandSize} cards remaining` : "No cards left"}
                </span>
            </div>
        </div>
    )
}

export default Enemy;