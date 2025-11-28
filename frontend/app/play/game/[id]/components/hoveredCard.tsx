"use client";

import { useGameSessionStore } from "@/store/useGameSessionStore";
import Image from 'next/image';

const HoveredCard = () => {
    const hoveredCard = useGameSessionStore(state => state.hoveredCard);

    if (!hoveredCard) {
        return null;
    }

    const borderColor = (color : string)=> {
        switch(color) {
            case "RED":
                return "border-red-400"
            case "BLUE":
                return "border-blue-400"
            case "GREEN":
                return "border-emerald-400"     
            default:
                return "border-gray-500";           
        }
    }

    return (
        <div
            className={`
                absolute 
                left-4                   
                bottom-28                
                w-[280px]                
                h-[400px]                
                bg-gray-800/80           
                border-4      
                ${borderColor(hoveredCard.color)}
                rounded-xl               
                shadow-2xl               
                p-2                      
                z-50                     
                overflow-hidden          
                flex                     
                items-center             
                justify-center           
                animate-fadeInScale      
            `}
        >
            {hoveredCard.imageUrl && (
                <Image
                    src={hoveredCard.imageUrl}
                    alt={hoveredCard.name || "Hovered Card"}
                    layout="fill"       
                    objectFit="cover" 
                    className="rounded-lg" 
                />
            )}
        </div>
    );
};

export default HoveredCard;