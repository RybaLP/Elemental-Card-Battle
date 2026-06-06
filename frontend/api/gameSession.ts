import { getBackendUrl } from "./getBackendUrl";

export const startGame = async (roomId: string) => {
    const res = await fetch(`${getBackendUrl()}/game/start/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error(`Failed to start game session for room ${roomId}. Status: ${res.status}`);
    return res.json();
}

export const selectCard = async (sessionId: string, instanceId: string, playerId: string) => {
    const res = await fetch(`${getBackendUrl()}/game/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, instanceId, playerId })
    });
    if (!res.ok) throw new Error(`Failed to select card (instanceId: ${instanceId}) for player ${playerId} in session ${sessionId}. Status: ${res.status}`);
    if (res.status === 204) return null;
    return res.json();
}

export const playRandomCard = async (gameSessionId: string) => {
    const res = await fetch(`${getBackendUrl()}/game/randomCard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameSessionId })
    });
    if (!res.ok) throw new Error(`Failed to play random card for session ${gameSessionId}. Status: ${res.status}`);
}