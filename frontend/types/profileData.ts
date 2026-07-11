export interface OwnedCardDto {
  id: number;
  name: string;
  imageUrl: string;
  acquiredAt: string; 
}

export interface ProfileData {
  username: string;
  gamesWon: number;
  gamesLost: number;
  currency: number;
  ownedCards: OwnedCardDto[];
}