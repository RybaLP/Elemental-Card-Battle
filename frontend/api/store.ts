import privateClient from "./client/privateClient";
import { CardInStore } from "@/types/cardInStore";

export const fetchStore = async (): Promise<CardInStore[]> => {
  const { data } = await privateClient.get("/store");
  return data;
};

export const purchaseCard = async (cardId: number): Promise<void> => {
  await privateClient.post(`/store/${cardId}/purchase`);
};