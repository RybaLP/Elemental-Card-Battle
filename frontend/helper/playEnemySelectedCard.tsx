"use client";

import { useEffect, useRef } from "react";
import { useAudioStore } from "@/store/useAudioStore";

const PlayEnemySelectedCard = () => {
    
    const audioRef = useRef<HTMLAudioElement>(null);
    const playEnemySelectedCard = useAudioStore((state) => state.playEnemySelectedCard);
    const setPlayEnemySelectedCard = useAudioStore((state) => state.setPlayEnemySelectedCard);

    useEffect (() => {
        if (playEnemySelectedCard === true) {

            if (audioRef.current) {
                audioRef.current.volume = 0.5;
                audioRef.current?.play();
            }

            setPlayEnemySelectedCard(false);
        }
    } , [playEnemySelectedCard,setPlayEnemySelectedCard])

    return (
        <audio ref={audioRef} src={"/audio/select-card-sound.mp3"} preload="auto" />
    )
}

export default PlayEnemySelectedCard;