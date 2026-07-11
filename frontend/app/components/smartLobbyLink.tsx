"use client";
import Link from "next/link";
import { useSmartLobby } from "@/hooks/useSmartLobby";

interface Props {
  children: React.ReactNode;
  className?: string;
  asButton?: boolean;
  onClick?: () => void;
}

export default function SmartLobbyLink({ children, className, asButton = false, onClick }: Props) {
  const { lobbyUrl, isInRoom } = useSmartLobby();

  const baseClass = className || "text-gray-300 hover:text-white transition-colors";

  if (asButton) {
    return (
      <Link href={lobbyUrl} className={baseClass} onClick={onClick}>
        {children}
        {isInRoom && (
          <span className="ml-1 text-xs text-purple-400"> (return to room)</span>
        )}
      </Link>
    );
  }

  return (
    <Link href={lobbyUrl} className={baseClass} onClick={onClick}>
      {children}
      {isInRoom && (
        <span className="ml-1 text-xs text-purple-400"> (return to room)</span>
      )}
    </Link>
  );
}