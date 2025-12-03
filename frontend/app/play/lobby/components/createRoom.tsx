"use client";
import { useState } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { createPublicRoom } from "@/api/room";
import { useRouter } from "next/navigation";
import { useCurrentRoomStore } from "@/store/useCurrentRoomStore";

const CreateRoom = () => {
    const [name, setName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { player } = usePlayerStore();
    const { setCurrentRoom } = useCurrentRoomStore();
    const router = useRouter();

    const handleCreatePublicRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        
        setIsLoading(true);
        try {
            const response = await createPublicRoom(name, player.id);
            if (response) {
                setCurrentRoom(response);
                router.push(`/play/lobby/${response.id}`);
            } else {
                throw new Error("Couldn't create new room");
            }
        } catch (error) {
            console.error("Error creating room:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleOpen = () => {
        setIsOpen(true);
        setName("");
    }

    const handleClose = () => {
        setIsOpen(false);
        setName("");
    }

    return (
        <>
            <button
                onClick={handleOpen}
                className="fixed bottom-8 right-8 z-10 bg-linear-to-r from-purple-600 to-purple-700 
                         hover:from-purple-700 hover:to-purple-800 text-white font-bold p-4 rounded-full 
                         shadow-2xl transition-all duration-300 transform hover:scale-110 
                         focus:outline-none focus:ring-4 focus:ring-purple-500/50 group"
            >
                <div className="flex items-center justify-center w-12 h-12">
                    <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div 
                        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-purple-500/30 
                                 transform transition-all duration-300 scale-95 hover:scale-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-700">
                            <h2 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                                Create New Lobby
                            </h2>
                        </div>

                        <form onSubmit={handleCreatePublicRoom} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="roomName" className="text-gray-300 text-sm font-medium">
                                    Room Name
                                </label>
                                <input 
                                    id="roomName"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Wprowadź nazwę pokoju..."
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg 
                                             text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                                             focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    autoComplete="off"
                                    maxLength={30}
                                    autoFocus
                                />
                                <p className="text-xs text-gray-500 text-right">
                                    {name.length}/30
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white 
                                             font-medium rounded-lg transition-all duration-200 
                                             focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!name.trim() || isLoading}
                                    className="flex-1 bg-linear-to-r from-purple-600 to-purple-700 
                                             hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 
                                             disabled:to-gray-700 disabled:cursor-not-allowed text-white 
                                             font-semibold py-3 px-4 rounded-lg transition-all duration-200 
                                             transform hover:scale-[1.02] active:scale-[0.98] 
                                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Creating...
                                        </div>
                                    ) : (
                                        `Create "${name || "room"}"`
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default CreateRoom;