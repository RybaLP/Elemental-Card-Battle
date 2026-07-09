import { useStomp } from "../ws/stompContext";

export const usePlayCard = () => {
  const { client, connected } = useStomp();

  const playCard = (sessionId: string, instanceId: number) => {
    if (client && connected) {
      client.publish({
        destination: `/app/game/play/${sessionId}`,
        body: JSON.stringify({ instanceId: String(instanceId) }), 
      });
    }
  };

  return playCard;
};