export interface ActiveSession {
  userId: number | null;  
  nickname: string;
  email?: string;
  currentRoomId?: string;
  currentGameSessionId?: string;
}