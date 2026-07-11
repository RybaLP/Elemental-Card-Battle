"use client";

import { useState } from "react";
import { purchaseCard } from "@/api/store";

export const usePurchaseCard = (onSuccess?: () => void) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buyCard = async (cardId: number) => {
    setIsPending(true);
    setError(null);
    try {
      await purchaseCard(cardId);
      onSuccess?.(); 
    } catch (err) {
      setError("Purchase failed.");
    } finally {
      setIsPending(false);
    }
  };

  return { buyCard, isPending, error };
};