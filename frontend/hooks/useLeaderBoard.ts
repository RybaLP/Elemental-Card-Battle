"use client";
import { useState, useEffect } from "react";
import publicClient from "@/api/client/publicClient";

export interface LeaderboardEntry {
  username: string;
  gamesWon: number;
  gamesLost: number;
  winRate: number;
}

export const useLeaderboard = (limit = 5) => {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const res = await publicClient.get(`/users/leaderboard?limit=${limit}`);
        if (!cancelled) {
          setPlayers(res.data);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.response?.data?.message || err.message || "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [limit]);

  return { players, loading, error };
};