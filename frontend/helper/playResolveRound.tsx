"use client";

import { useEffect, useRef } from "react";
import { useAudioStore } from "@/store/useAudioStore";

const PlayResolveRound = () => {
    
    const audioRef = useRef<HTMLAudioElement>(null);

    const playResolveRound = useAudioStore((state) => state.playResolveRound);
    const setPlayResolveRound = useAudioStore((state) => state.setPlayResolveRound);

    useEffect (() => {
        if (playResolveRound === true) {

            if (audioRef.current) {
                audioRef.current.volume = 0.5;
                audioRef.current?.play();
            }

            setPlayResolveRound(false);
        }
    } , [playResolveRound,setPlayResolveRound])

    return (
        <audio ref={audioRef} src={"/audio/resolve-round-2.mp3"} preload="auto" />
    )
}

export default PlayResolveRound;