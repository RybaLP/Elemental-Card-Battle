package com.elemental_card_battle.elemental_card_battle.session;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class ActiveSessionManager {

    private final Map<Long,ActiveSession> sessions = new ConcurrentHashMap<>();

    public void registerSessions (ActiveSession session) {
        sessions.put(session.getUserId(), session);
    }

    public void removeSession (Long userId) {
        sessions.remove(userId);
    }

    public ActiveSession getSessions (Long userId) {
        return sessions.get(userId);
    }

    public boolean isOnline (Long userId) {
        return sessions.containsKey(userId);
    }

    public Collection<ActiveSession> getAllSessions () {
        return sessions.values();
    }

    public ActiveSession getSessionBySimpId(String simpSessionId) {
        return sessions.values().stream()
                .filter(s -> simpSessionId.equals(s.getSimpSessionId()))
                .findFirst()
                .orElse(null);
    }

    public ActiveSession getSessionByEmail(String email) {
        return sessions.values().stream()
                .filter(s -> email.equals(s.getEmail()))
                .findFirst()
                .orElse(null);
    }

    public void removeSessionBySimpSessionId (String sessionId) {
        ActiveSession activeSession = getSessionBySimpId(sessionId);
        if (activeSession != null) {
            sessions.remove(activeSession.getUserId());
        }
    }

}