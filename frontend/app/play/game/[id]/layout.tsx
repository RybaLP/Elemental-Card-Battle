// app/play/game/layout.tsx
import { ReactNode } from "react";

export default function GameLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/game-background.png')" }}
    >
      {children}
    </div>
  );
}
