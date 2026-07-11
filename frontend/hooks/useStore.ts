"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchStore } from "@/api/store";
import { CardInStore } from "@/types/cardInStore";

export const useStore = () => {
  const [cards, setCards] = useState<CardInStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStore = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchStore();
      setCards(data);
    } catch (err) {
      setError("Failed to load store.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  return { cards, isLoading, error, refresh: loadStore };
};