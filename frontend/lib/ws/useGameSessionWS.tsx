"use client";

import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useGameSessionStore } from "@/store/useGameSessionStore";

export const useGameSessionWS = (sessionId : string, playerId : string) => {

    const {setSession, setEnemyCard} = useGameSessionStore();

    useEffect( () =>{
        if (!sessionId) return;
        const socket = new SockJS(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`);
        
        const client = new Client({
            webSocketFactory : () => socket,
            reconnectDelay : 3000,
            debug : () => {}
        })

        client.onConnect = () => {
            client.subscribe(`/topic/game/${sessionId}/state`,
                (message) => {
                    const body = JSON.parse(message.body);

                    switch (body.event) {
                        case "fullState":
                            setSession(body.session);
                            break;
                        case "GAME_STATE_UPDATE":
                            setSession(body.session);
                            break;
                        default : 
                            throw new Error("Error");
                    }
                }
            ),
            client.subscribe(`/topic/game/${sessionId}/card` , (message) => {
                const body = JSON.parse(message.body);

                if (body.event === "CARD_SELECTED") {
                    if (body.playerId !== playerId && body.card) {
                        setEnemyCard(body.card);
                    }
                }

            }),
            client.subscribe(`/topic/game/${sessionId}/winner`, (message) => {
                const body = JSON.parse(message.body);
                const store = useGameSessionStore.getState();

                store.setIsRevealing(true);

                setTimeout (() => {
                     // verify who is who and set proeply winning points...
                    const myRounds = body.p1Id === playerId ? body.p1Rounds : body.p2Rounds;    
                    const enemyRounds = body.p1Id === playerId ? body.p2Rounds : body.p1Rounds; 

                    // set rounds state
                    store.setMyWonRounds(myRounds);
                    store.setEnemyWonRounds(enemyRounds);

                    // restart state (revealing included)
                    store.resetTurn();

                } , 2500);
            })
        }

        client.activate();
        return () => {client.deactivate();}

    },[sessionId])
}