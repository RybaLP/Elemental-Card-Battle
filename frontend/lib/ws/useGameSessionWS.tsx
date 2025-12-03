"use client";

import { useEffect } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import { playCardPick } from "../../helper/cardAudioManager";
import { useAudioStore } from "@/store/useAudioStore";


export const useGameSessionWS = (sessionId : string, playerId : string) => {

    const {setSession, setEnemyCard} = useGameSessionStore();

    useEffect( () =>{
        if (!sessionId) return;

        const socket = new SockJS(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`);
        
        const client = Stomp.over(socket);

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
                const audioStore = useAudioStore.getState();

                store.setIsRevealing(true);

                setTimeout (() => {

                    audioStore.setPlayResolveRound(true);

                    const myRounds = body.p1Id === playerId ? body.p1Rounds : body.p2Rounds;    
                    const enemyRounds = body.p1Id === playerId ? body.p2Rounds : body.p1Rounds; 

                    const myCards = body.p1Id === playerId ? body.p1Cards : body.p2Cards;

                    store.setMyWonRounds(myRounds);
                    store.setEnemyWonRounds(enemyRounds);

                    store.resetTurn(myCards);

                } , 2500);
            })

            client.subscribe(`/topic/game/${sessionId}/countdown`, (message) => {
                const body = JSON.parse(message.body);
                const setTimer = useGameSessionStore.getState().setTimer;

                if (body.event === "countDown") {
                    setTimer(body.seconds);
                }
            }),


            client.subscribe(`/topic/game/${sessionId}/randomCard` , (message) => {
                const body = JSON.parse(message.body);
                const store = useGameSessionStore.getState();
                const audioStore = useAudioStore.getState();

                if (body.event === "randomCard") {
                    if (store.myPlayer?.playerId === body.playerId){
                        store.setSelectedCard(body.card);
                        playCardPick();

                    } else {
                        playCardPick();
                        audioStore.setPlayEnemySelectedCard(true);
                        store.setEnemyCard(body.card);
                        store.setIsRevealing(true);
                    }
                }
            }),

            client.subscribe(`/topic/game/${sessionId}/countdown/start`, (message) => {
                const body = JSON.parse(message.body);
                const store = useGameSessionStore.getState();
                if (body.event === "startCountdown") {
                    store.setShowTimer(true);
                }
            }),

            client.subscribe(`/topic/game/${sessionId}/countdown/stop`, (message) => {
                const body = JSON.parse(message.body);
                const store = useGameSessionStore.getState();
                if (body.event === "stopCountdown") {
                    store.setShowTimer(false);
                }
            }),

            client.subscribe(`/topic/game/${sessionId}/game-over` , (message) => {
                const body = JSON.parse(message.body);
                const store = useGameSessionStore.getState();
                
                if (body.event === "gameOver") {
                    store.setIsGameOver(true);
                    store.setGameWinnerMessage(body.message);
                }
            })
        }

        client.activate();

        return () => {client.deactivate();}

    },[sessionId])
}