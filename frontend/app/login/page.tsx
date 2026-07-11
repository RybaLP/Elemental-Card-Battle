"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AnimatedBackground from "@/components/animatedBg";
import { login, register } from "@/api/auth";

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "register">("login");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === "login") {
                await login(form.email, form.password);
            } else {
                await register(form.username, form.email, form.password, form.confirmPassword);
            }
            router.push("/play/lobby");
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen">
            <AnimatedBackground />

            {/* Back Button */}
            <Link 
                href="/" 
                className="fixed top-6 left-6 z-50 px-4 py-2 rounded-lg bg-purple-900/80 backdrop-blur-md border border-purple-500/50 text-white hover:border-cyan-400/50 transition-all duration-200 text-sm font-black uppercase tracking-wider"
            >
                ← Back
            </Link>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                <Image alt="logo" width={140} height={140} src="/logo-.png" className="mb-8" />

                <div className="w-full max-w-sm bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-8">

                    <div className="flex mb-6 rounded-lg overflow-hidden border border-white/10">
                        <button
                            type="button"
                            onClick={() => { setMode("login"); setError(null); }}
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${
                                mode === "login"
                                    ? "bg-white/20 text-white"
                                    : "text-white/50 hover:text-white/80"
                            }`}
                        >
                            Sign in
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode("register"); setError(null); }}
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${
                                mode === "register"
                                    ? "bg-white/20 text-white"
                                    : "text-white/50 hover:text-white/80"
                            }`}
                        >
                            Register
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {mode === "register" && (
                            <input
                                name="username"
                                type="text"
                                placeholder="Username"
                                value={form.username}
                                onChange={handleChange}
                                required
                                className="bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/30"
                            />
                        )}

                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/30"
                        />

                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/30"
                        />

                        {mode === "register" && (
                            <input
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                className="bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/30"
                            />
                        )}

                        {error && (
                            <p className="text-red-400 text-xs text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 bg-white/20 hover:bg-white/30 border border-white/20 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                        >
                            {loading ? "..." : mode === "login" ? "Sign in" : "Create account"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}