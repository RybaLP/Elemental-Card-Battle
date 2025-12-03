export const audio = new Audio("/audio/card-pick.mp3");
audio.volume = 0.5;

export const playCardPick = () => {
  audio.currentTime = 0; 
  audio.play().catch((e) => {
    console.warn("Audio blocked:", e);
  });
};

export const playResolveRound = () => {
  audio.currentTime = 0;
  audio.play().catch((e) => {
    console.warn("Audio blocked: ", e)
  })
}