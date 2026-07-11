"use client";
import { useRef, useState, useEffect } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value, 10));
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-purple-900/80 backdrop-blur-md px-4 py-2 rounded-lg border border-purple-500/50 shadow-lg hover:border-cyan-400/50 transition-all duration-200">
      <audio
        ref={audioRef}
        src="/audio/Angevin.mp3"
        autoPlay
        loop
        className="hidden"
      />

      <button
        onClick={toggleMute}
        className={`px-3 py-1 rounded font-black text-xs uppercase tracking-wider transition-all duration-200 border ${
          isMuted
            ? "bg-red-600/40 text-red-400 border-red-500/50 hover:bg-red-600/60"
            : "bg-cyan-500/40 text-cyan-300 border-cyan-500/50 hover:bg-cyan-500/60"
        }`}
      >
        {isMuted ? "Mute" : "On"}
      </button>

      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        className="w-28 h-1 bg-purple-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all"
      />

      <span className="text-xs font-black text-purple-300 w-10 text-right">
        {isMuted ? "0" : volume}%
      </span>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
        }

        input[type="range"]::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer;