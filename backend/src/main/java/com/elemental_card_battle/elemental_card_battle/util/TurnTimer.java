package com.elemental_card_battle.elemental_card_battle.util;

import com.elemental_card_battle.elemental_card_battle.model.GameSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
public class TurnTimer {

    private ScheduledExecutorService scheduler;
    private final GameSessionBroadcaster gameSessionBroadcaster;

    public void startTimer(GameSession gameSession, int seconds, Runnable onTimeOut) {
        scheduler = Executors.newSingleThreadScheduledExecutor();

        scheduler.scheduleAtFixedRate(new Runnable() {
            int timeLeft = seconds;

            @Override
            public void run() {
                if (timeLeft > 0) {
                    timeLeft--;
                    gameSessionBroadcaster.broadcastCountDown(gameSession,timeLeft);
                } else {
                    if (onTimeOut != null) onTimeOut.run();
                    scheduler.shutdown();
                }
            }
        }, 0, 1, TimeUnit.SECONDS);
    }


    public void cancelTimer() {
        if (scheduler != null && !scheduler.isShutdown()) {
            scheduler.shutdownNow();
        }
    }
}
