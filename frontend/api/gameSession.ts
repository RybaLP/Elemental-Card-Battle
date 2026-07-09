import privateClient from "./client/privateClient";
import { GameSession } from "@/types/gameSession";

export const startGame = async (roomId: string): Promise<GameSession> => {
  const res = await privateClient.post("/game-session/start", { roomId });
  return res.data;
};

export const getGameSession = async (sessionId: string): Promise<GameSession> => {
  const res = await privateClient.get(`/game-session/${sessionId}`);
  return res.data;
};