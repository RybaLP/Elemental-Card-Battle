"use client";
import { useCurrentRoomStore } from "@/store/useCurrentRoomStore";

export const useSmartLobby = () => {
  const currentRoom = useCurrentRoomStore((state) => state.currentRoom);

  const lobbyUrl = currentRoom?.id
    ? `/play/lobby/${currentRoom.id}`
    : "/play/lobby";

  const isInRoom = !!currentRoom;

  return { lobbyUrl, isInRoom };
};