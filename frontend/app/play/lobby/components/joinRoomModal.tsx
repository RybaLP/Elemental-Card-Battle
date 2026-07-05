"use client";

import { useState } from "react";

interface Props {
    roomName: string;
    onClose: () => void;
    onJoin: (password: string) => Promise<void>;
}

export default function JoinRoomModal({ roomName, onClose, onJoin }: Props) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) return;
        setLoading(true);
        setError(null);
        try {
            await onJoin(password.trim());
        } catch {
            setError("Invalid password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
             onClick={onClose}>
            <div className="w-full max-w-sm bg-[#13132a] border border-purple-500/30 rounded-2xl p-6 shadow-2xl"
                 onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold text-white mb-1">Join room</h2>
                <p className="text-xs text-gray-500 mb-5 truncate">{roomName}</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        autoFocus
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError(null);
                        }}
                        placeholder="Password"
                        maxLength={20}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5
                                   text-white placeholder-gray-600 text-sm
                                   focus:outline-none focus:border-purple-500/60 transition-colors"
                    />

                    {error && (
                        <p className="text-xs text-red-400 -mt-2">{error}</p>
                    )}

                    <div className="flex gap-3">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg text-sm text-gray-400
                                       border border-white/10 hover:border-white/20 transition-colors">
                            Cancel
                        </button>
                        <button type="submit"
                            disabled={!password.trim() || loading}
                            className="flex-1 py-2.5 rounded-lg text-sm font-medium
                                       bg-purple-600 hover:bg-purple-700 text-white
                                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                            {loading ? "Joining…" : "Join"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}