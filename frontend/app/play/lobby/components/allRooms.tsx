"use client";

import { useEffect, useState } from "react";
import { Room } from "@/types/room";
import useRoomsWS from "@/lib/ws/useRoomsWS";
import { useRouter } from "next/navigation";
import { useCurrentRoomStore } from "@/store/useCurrentRoomStore";
import { fetchRooms, joinRoom, createPublicRoom, createPrivateRoom } from "@/api/room";
import CreateRoomModal from "./createRoomModal";
import JoinRoomModal from "./joinRoomModal";

function RoomCard({ room, onJoin }: { room: Room; onJoin: (room: Room) => void }) {
    const playerCount = room.players.length;

    return (
        <div className={`relative rounded-xl border p-5 flex flex-col gap-4 transition-all duration-200
            ${room.isFull
                ? "border-white/5 bg-white/3 opacity-60"
                : "border-purple-500/20 bg-[#13132a]/60 hover:border-purple-400/40 hover:bg-[#16163a]/70"
            }`}>

            {room.isPrivate && (
                <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-widest
                                 text-amber-400 border border-amber-400/30 rounded px-1.5 py-0.5">
                    Private
                </span>
            )}

            <div>
                <h3 className="text-white font-semibold text-base truncate pr-12">{room.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">#{room.id.slice(0, 8)}</p>
            </div>

            <div className="flex items-center gap-2">
                {[0, 1].map((i) => (
                    <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors
                        ${i < playerCount ? "bg-purple-500" : "bg-white/10"}`} />
                ))}
                <span className="text-xs text-gray-400 ml-1">{playerCount}/2</span>
            </div>

            <button
                disabled={room.isFull}
                onClick={() => onJoin(room)}
                className="w-full py-2 rounded-lg text-sm font-medium transition-all duration-200
                           disabled:cursor-not-allowed disabled:opacity-40
                           bg-purple-600/20 hover:bg-purple-600/40 text-purple-300
                           border border-purple-500/20 hover:border-purple-400/50
                           disabled:hover:bg-purple-600/20 disabled:hover:border-purple-500/20"
            >
                {room.isFull ? "Full" : "Join"}
            </button>
        </div>
    );
}

const RoomsList = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [joiningRoom, setJoiningRoom] = useState<Room | null>(null);
    const { setCurrentRoom } = useCurrentRoomStore();
    const router = useRouter();

    useRoomsWS(setRooms);

    useEffect(() => {
        fetchRooms().then(setRooms).catch(console.error);
    }, []);

    const goToRoom = async (id: string, password?: string) => {
        const res = await joinRoom(id, password);
        setCurrentRoom(res);
        router.push(`/play/lobby/${id}`);
    };

    const handleJoinClick = (room: Room) => {
        if (room.isPrivate) {
            setJoiningRoom(room);
        } else {
            goToRoom(room.id).catch(console.error);
        }
    };

    const handleJoinWithPassword = async (password: string) => {
        if (!joiningRoom) return;
        await goToRoom(joiningRoom.id, password);
        setJoiningRoom(null);
    };

    const handleCreate = async (name: string, password?: string) => {
        const res = password
            ? await createPrivateRoom(name, password)
            : await createPublicRoom(name);
        setCurrentRoom(res);
        setShowModal(false);
        router.push(`/play/lobby/${res.id}`);
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <p className="text-xs text-purple-400 uppercase tracking-widest mb-1">Multiplayer</p>
                    <h1 className="text-3xl font-bold text-white">Game Rooms</h1>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                               bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200">
                    <span className="text-lg leading-none">+</span> New Room
                </button>
            </div>

            <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-500">Live — {rooms.length} room{rooms.length !== 1 ? "s" : ""}</span>
            </div>

            {rooms.length === 0 ? (
                <div className="text-center py-24">
                    <p className="text-gray-500 text-sm">No rooms yet.</p>
                    <button onClick={() => setShowModal(true)}
                        className="mt-4 text-purple-400 text-sm hover:text-purple-300 transition-colors">
                        Create the first one →
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {rooms.map((room) => (
                        <RoomCard key={room.id} room={room} onJoin={handleJoinClick} />
                    ))}
                </div>
            )}

            {showModal && (
                <CreateRoomModal onClose={() => setShowModal(false)} onCreate={handleCreate} />
            )}

            {joiningRoom && (
                <JoinRoomModal
                    roomName={joiningRoom.name}
                    onClose={() => setJoiningRoom(null)}
                    onJoin={handleJoinWithPassword}
                />
            )}
        </div>
    );
};

export default RoomsList;