package com.elemental_card_battle.elemental_card_battle.util;

import com.elemental_card_battle.elemental_card_battle.model.GameSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.*;

@Component
@RequiredArgsConstructor
public class TurnTimer {

    private final GameSessionBroadcaster gameSessionBroadcaster;
    private final Map<String, ScheduledExecutorService> timers = new ConcurrentHashMap<>();

    public void startTimer(GameSession gameSession, int seconds, Runnable onTimeOut) {
        cancelTimer(gameSession);

        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        timers.put(gameSession.getId(), scheduler);

        scheduler.scheduleAtFixedRate(new Runnable() {
            int timeLeft = seconds;

            @Override
            public void run() {
                if (timeLeft > 0) {
                    timeLeft--;
                    gameSessionBroadcaster.broadcastCountDown(gameSession, timeLeft);
                } else {
                    if (onTimeOut != null) onTimeOut.run();
                    scheduler.shutdown();
                    timers.remove(gameSession.getId());
                }
            }
        }, 0, 1, TimeUnit.SECONDS);
    }

    public void cancelTimer(GameSession gameSession) {
        ScheduledExecutorService scheduler = timers.remove(gameSession.getId());
        if (scheduler != null && !scheduler.isShutdown()) {
            scheduler.shutdownNow();
        }
    }
}