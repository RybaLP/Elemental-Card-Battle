// app/play/game/layout.tsx
import { ReactNode } from "react";
import ExitWarning from "@/app/components/exitWarning";

export default function GameLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/game-background.png')" }}
    >
      <ExitWarning/>
      {children}
    </div>
  );
}
