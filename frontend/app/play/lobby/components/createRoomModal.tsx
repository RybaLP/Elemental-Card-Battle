"use client";

import { useState } from "react";

interface Props {
    onClose: () => void;
    onCreate: (name: string, password?: string) => Promise<void>;
}

export default function CreateRoomModal({ onClose, onCreate }: Props) {
    const [name, setName] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        if (isPrivate && !password.trim()) return;
        setLoading(true);
        try {
            await onCreate(name.trim(), isPrivate ? password.trim() : undefined);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
             onClick={onClose}>
            <div className="w-full max-w-sm bg-[#13132a] border border-purple-500/30 rounded-2xl p-6 shadow-2xl"
                 onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold text-white mb-5">New room</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        autoFocus
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Room name"
                        maxLength={30}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5
                                   text-white placeholder-gray-600 text-sm
                                   focus:outline-none focus:border-purple-500/60 transition-colors"
                    />

                    {/* Public / Private toggle */}
                    <div className="flex rounded-lg overflow-hidden border border-white/10">
                        <button type="button" onClick={() => setIsPrivate(false)}
                            className={`flex-1 py-2 text-sm transition-colors ${
                                !isPrivate ? "bg-purple-600/40 text-white" : "text-gray-500 hover:text-gray-300"
                            }`}>
                            Public
                        </button>
                        <button type="button" onClick={() => setIsPrivate(true)}
                            className={`flex-1 py-2 text-sm transition-colors ${
                                isPrivate ? "bg-purple-600/40 text-white" : "text-gray-500 hover:text-gray-300"
                            }`}>
                            Private
                        </button>
                    </div>

                    {isPrivate && (
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            maxLength={20}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5
                                       text-white placeholder-gray-600 text-sm
                                       focus:outline-none focus:border-purple-500/60 transition-colors"
                        />
                    )}

                    <div className="flex gap-3">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg text-sm text-gray-400
                                       border border-white/10 hover:border-white/20 transition-colors">
                            Cancel
                        </button>
                        <button type="submit"
                            disabled={!name.trim() || (isPrivate && !password.trim()) || loading}
                            className="flex-1 py-2.5 rounded-lg text-sm font-medium
                                       bg-purple-600 hover:bg-purple-700 text-white
                                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                            {loading ? "Creating…" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}