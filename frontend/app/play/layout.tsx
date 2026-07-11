"use client";

import { StompProvider } from "@/lib/ws/stompContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/api/auth";
import { useRouter } from "next/navigation";
import SmartLobbyLink from "../components/smartLobbyLink";
import { usePlayerStore } from "@/store/usePlayerStore";
import Image from "next/image";

const navLinks = [
    { href: "/play/lobby", label: "Lobby" },
    { href: "/play/store", label: "Store" },
    { href: "/play/profile", label: "Profile" },
];

function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const player = usePlayerStore((state) => state.player);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16
                        bg-[#0d0d1a]/80 backdrop-blur-md
                        border-b border-purple-900/40">
            <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">

                <div className="flex items-center gap-1">
                    {navLinks.map((link) => {
                        const active = pathname.startsWith(link.href);
                        
                        if (link.href === "/play/lobby") {
                            return (
                                <SmartLobbyLink
                                    key={link.href}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                                        ${active
                                            ? "bg-purple-600/30 text-purple-300 border border-purple-500/40"
                                            : "text-gray-400 hover:text-purple-300 hover:bg-purple-600/10"
                                        }`}
                                >
                                    {link.label}
                                </SmartLobbyLink>
                            );
                        }

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                                    ${active
                                        ? "bg-purple-600/30 text-purple-300 border border-purple-500/40"
                                        : "text-gray-400 hover:text-purple-300 hover:bg-purple-600/10"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4">
                    {player && (
                        <div className="flex items-center gap-2 text-sm bg-purple-600/20 border border-purple-500/30 rounded-lg px-3 py-1.5 hover:border-cyan-400/50 transition-all duration-200">
                            <Image 
                                src="/ecb-coin.png" 
                                alt="Coins" 
                                width={20} 
                                height={20}
                                className="w-5 h-5"
                            />
                            <span className="text-gray-300 font-black tracking-wider">
                                {player.currency.toLocaleString()}
                            </span>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-500 hover:text-red-400 transition-colors duration-200"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default function PlayLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isGameRoute = pathname.startsWith("/play/game/");

    return (
        <StompProvider>
            <div
                className="fixed inset-0 -z-10"
                style={{
                    backgroundImage: "url('/game-background.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            />
            <div className="fixed inset-0 -z-10 bg-[#0d0d1a]/70" />

            {!isGameRoute && <Navbar />}

            <main className={isGameRoute ? "min-h-screen" : "pt-16 min-h-screen"}>
                {children}
            </main>
        </StompProvider>
    );
}