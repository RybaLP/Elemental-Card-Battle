"use client";

import { useEffect } from "react";
import { useGameSessionStore } from "@/store/useGameSessionStore";
import { useAudioStore } from "@/store/useAudioStore";
import { playCardPick } from "../../helper/cardAudioManager";
import { useStomp } from "../ws/stompContext";

export const useGameSessionWS = (sessionId: string, userId: number) => {
    const { client, connected } = useStomp();
    const { setSession, setEnemyCard } = useGameSessionStore();

    useEffect(() => {
        if (!client || !connected || !sessionId) return;

        const subs = [
            client.subscribe(`/topic/game/${sessionId}/state`, (message) => {
                const body = JSON.parse(message.body);
                if (body.event === "fullState" || body.event === "GAME_STATE_UPDATE") {
                    setSession(body.session);
                }
            }),

            client.subscribe(`/topic/game/${sessionId}/card`, (message) => {
                const body = JSON.parse(message.body);
                if (body.event === "CARD_SELECTED" && body.userId !== userId && body.card) {
                    setEnemyCard(body.card);
                }
            }),

            client.subscribe(`/topic/game/${sessionId}/winner`, (message) => {
                const body = JSON.parse(message.body);
                const store = useGameSessionStore.getState();
                const audioStore = useAudioStore.getState();

                store.setIsRevealing(true);
                setTimeout(() => {
                    audioStore.setPlayResolveRound(true);
                    const isP1 = body.p1Id === userId;
                    store.setMyWonRounds(isP1 ? body.p1Rounds : body.p2Rounds);
                    store.setEnemyWonRounds(isP1 ? body.p2Rounds : body.p1Rounds);
                    store.resetTurn(isP1 ? body.p1Cards : body.p2Cards);
                }, 2500);
            }),

            client.subscribe(`/topic/game/${sessionId}/countdown`, (message) => {
                const body = JSON.parse(message.body);
                if (body.event === "countDown") {
                    useGameSessionStore.getState().setTimer(body.seconds);
                }
            }),

            client.subscribe(`/topic/game/${sessionId}/randomCard`, (message) => {
                const body = JSON.parse(message.body);
                const store = useGameSessionStore.getState();
                const audioStore = useAudioStore.getState();
                if (body.event === "randomCard") {
                    if (body.userId === userId) {
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
                if (body.event === "startCountdown") {
                    useGameSessionStore.getState().setShowTimer(true);
                }
            }),

            client.subscribe(`/topic/game/${sessionId}/countdown/stop`, (message) => {
                const body = JSON.parse(message.body);
                if (body.event === "stopCountdown") {
                    useGameSessionStore.getState().setShowTimer(false);
                }
            }),

            client.subscribe(`/topic/game/${sessionId}/game-over`, (message) => {
                const body = JSON.parse(message.body);
                if (body.event === "gameOver") {
                    useGameSessionStore.getState().setIsGameOver(true);
                    useGameSessionStore.getState().setGameWinnerMessage(body.message);
                }
            }),
        ];

        return () => subs.forEach(sub => sub.unsubscribe());
    }, [client, connected, sessionId, userId]);
};