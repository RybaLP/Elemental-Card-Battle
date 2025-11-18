"use client";

import PlayerSlot from "./playerSlot";
import { useCurrentRoomStore } from "@/store/useCurrentRoomStore";
import { useRoomWS } from "@/lib/ws/useRoomWS";
import ChatBox from "./chatBox";
import { leaveRoom } from "@/api/room";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/api/message";

const RoomLobby = () => {

  const {player} = usePlayerStore();
  const { currentRoom, setCurrentRoom } = useCurrentRoomStore();
  const router = useRouter();

  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-xl">Loading room...</p>
        </div>
      </div>
    );
  } 

  useRoomWS(currentRoom.id, setCurrentRoom);

  const owner = currentRoom.players[0];
  const guest = currentRoom.players[1];

  const handleLeaveRoom = async () => {
      const message = await sendMessage(currentRoom.id, player.id, player.nickname, `Left the lobby`);
      const res = await leaveRoom(player.id, currentRoom.id);
      router.push("/play/lobby");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
            {currentRoom.name}
          </h1>
          <p className="text-gray-400">ID: {currentRoom.id}</p>
          <div className="flex justify-center items-center gap-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {currentRoom.players.length}/2 players
            </div>
            <span>•</span>
            <div>Waiting for player...</div>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          <div className="flex-1 max-w-md">
            <div className="text-center mb-4">
              <span className="text-purple-400 font-semibold text-lg">Owner</span>
            </div>
            {owner && <PlayerSlot player={owner}  />}
          </div>

          <div className="flex-1 max-w-2xl">
            <ChatBox />
          </div>

          <div className="flex-1 max-w-md">
            <div className="text-center mb-4">
              <span className="text-blue-400 font-semibold text-lg">Guest</span>
            </div>
            {guest ? (
              <PlayerSlot player={guest}/>
            ) : (
              <div className="w-full h-[200px] bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-2xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">👤</div>
                  <p>Waiting for player...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
            <span className="text-white text-sm">
              <button onClick={handleLeaveRoom}>
                Leave room
              </button>
            </span>
          </div>
        </div>
  
      </div>
    </div>
  );
};

export default RoomLobby;