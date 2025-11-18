"use client";

import { useEffect, useState } from "react";
import { Room } from "@/types/room";
import useRoomsWS from "@/lib/ws/useRoomsWS";
import { joinPublicRoom } from "@/api/room";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useRouter } from "next/navigation";
import { useCurrentRoomStore } from "@/store/useCurrentRoomStore";
import { sendMessage } from "@/api/message";

interface Props {
  allRooms : Room [];
}

const RoomsList = ({allRooms} : Props) => {

  const [rooms, setRooms] = useState<Room[]>([]);
  const { player } = usePlayerStore();
  const { currentRoom, setCurrentRoom } = useCurrentRoomStore();
  
  const router = useRouter();

  useRoomsWS(setRooms);

  useEffect(() => {
  setRooms(allRooms);
  }, [allRooms]);

  const handleJoinRoom = async (id: string) => {
    const res = await joinPublicRoom(player.id, id);
    if (res) {
      setCurrentRoom(res);
      router.push(`/play/lobby/${id}`);
      if (currentRoom) {
        await sendMessage(res.id, player.id, player.nickname, "Joined the lobby");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
            Rooms list
          </h2>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl mb-4">🎮</div>
              <p className="text-gray-400 text-lg">No available rooms</p>
              <p className="text-gray-500 text-sm mt-2">Create a new room or wait for one to be created</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`bg-gray-800 rounded-xl p-6 border-2 transition-all duration-300 hover:scale-[1.02] ${
                  room.isFull 
                    ? "border-red-500/30 bg-gray-800/60" 
                    : "border-purple-500/30 hover:border-purple-400/50"
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 truncate">
                      {room.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          room.isFull ? "bg-red-500" : "bg-green-500"
                        }`}></div>
                        {room.isFull ? "Pełny" : "Dostępny"}
                      </span>
                      <span>ID: {room.id.slice(0, 8)}...</span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-300">
                      <div className="flex justify-between">
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    {room.isFull ? (
                      <div className="text-center py-2">
                        <span className="text-red-400 text-sm font-medium px-3 py-1 bg-red-500/20 rounded-full">
                          Room is full
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleJoinRoom(room.id)}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 
                                 hover:from-purple-700 hover:to-purple-800 text-white 
                                 font-semibold py-3 px-4 rounded-lg transition-all duration-200 
                                 transform hover:scale-[1.02] active:scale-[0.98] 
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        Enter room
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8 text-gray-500 text-sm">
          The room list updates in real time
        </div>
      </div>
    </div>
  );
};

export default RoomsList;