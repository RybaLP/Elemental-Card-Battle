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
    <div className="fixed bottom-4 right-4 flex items-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-md">
      <audio
        ref={audioRef}
        src="/audio/Angevin.mp3"
        autoPlay
        loop
        className="hidden"
      />

      <button
        onClick={toggleMute}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isMuted ? "Enable" : "Mute"}
      </button>

      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        className="w-32 accent-blue-500"
      />

      <span className="text-white">{volume}%</span>
    </div>
  );
};

export default AudioPlayer;
