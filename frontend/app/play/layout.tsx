"use client";

import { StompProvider } from "@/lib/ws/stompContext";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/api/auth";
import { useRouter } from "next/navigation";

const navLinks = [
    { href: "/play/lobby", label: "Lobby" },
    { href: "/play/store", label: "Store" },
    { href: "/play/profile", label: "Profile" },
];

function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16
                        bg-[#0d0d1a]/80 backdrop-blur-md
                        border-b border-purple-900/40">
            <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/play/lobby" className="flex items-center gap-2 shrink-0">
                    <Image src="/logo-.png" alt="Elemental Card Battle" width={40} height={40} />
                </Link>

                {/* Nav links */}
                <div className="flex items-center gap-1">
                    {navLinks.map((link) => {
                        const active = pathname.startsWith(link.href);
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

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-red-400 transition-colors duration-200"
                >
                    Sign out
                </button>
            </div>
        </nav>
    );
}

export default function PlayLayout({ children }: { children: React.ReactNode }) {
    return (
        <StompProvider>
            {/* Background */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    backgroundImage: "url('/game-background.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            />
            {/* Dark overlay */}
            <div className="fixed inset-0 -z-10 bg-[#0d0d1a]/70" />

            <Navbar />

            <main className="pt-16 min-h-screen">
                {children}
            </main>
        </StompProvider>
    );
}