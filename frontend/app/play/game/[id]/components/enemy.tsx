"use client";

import Image from "next/image";
import { useGameSessionStore } from "@/store/useGameSessionStore";

const Enemy = () => {
    const enemyHandSize = useGameSessionStore(state => state.enemyPlayer?.currentHand?.length || 4);
    const cards = Array.from({ length: enemyHandSize });

    return (
        
        <div className="flex flex-col items-start">
            
            <div className="grid grid-cols-2 grid-rows-2 gap-6">
                {cards.map((_, index) => (
                    <div
                        key={index}
                        className="relative transition-transform duration-300 hover:scale-105"
                    >
                        <div className="w-40 h-52 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-600 bg-linear-to-br from-red-900/80 to-gray-900/80 relative">
                            <Image 
                                src="/back-card.png"
                                alt="Hidden Card"
                                fill 
                                className="object-cover"
                            />
                            
                            <div className="absolute inset-0 bg-black/20"></div>
                        </div>
                        
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default Enemy;