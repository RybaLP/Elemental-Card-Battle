"use client";

import { useLeaderboard } from "@/hooks/useLeaderBoard";

const fallbackPlayers = [
  { username: "ShadowNinja", gamesWon: 0, gamesLost: 0, winRate: 0.0 },
  { username: "FrostWolf", gamesWon: 0, gamesLost: 0, winRate: 0.0 },
  { username: "AquaMaster", gamesWon: 0, gamesLost: 0, winRate: 0.0 },
  { username: "FlameStrike", gamesWon: 0, gamesLost: 0, winRate: 0.0 },
  { username: "IceSorceress", gamesWon: 0, gamesLost: 0, winRate: 0.0 },
];

export default function TopPlayers() {
  const { players, loading, error } = useLeaderboard(5);
  const hasData = !loading && !error && players.length > 0;
  const showFallback = !loading && !error && players.length === 0;

  return (
    <section className="w-full max-w-4xl my-16">
      <header className="mb-8 animate-fade-down">
        <h2 className="text-3xl font-black text-white mb-2 tracking-widest">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            TOP PLAYERS
          </span>
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-transparent animate-pulse"></div>
      </header>

      <article className="rounded-xl border-2 border-purple-500/80 bg-gradient-to-b from-purple-900/80 to-purple-900/50 p-8 backdrop-blur-md shadow-2xl shadow-purple-900/50 animate-fade-up">
        <header className="mb-6 pb-4 border-b border-purple-500/40">
          <h3 className="text-sm font-black text-purple-300 uppercase tracking-widest">
            Season 1 Rankings
          </h3>
        </header>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && <p className="text-red-400 text-center py-4">{error}</p>}

        {(hasData || showFallback) && (
          <div className="space-y-3">
            {(showFallback ? fallbackPlayers : players).map((player, index) => {
              const rank = index + 1;
              const winRatePercent = (player.winRate * 100).toFixed(1);
              const totalGames = player.gamesWon + player.gamesLost;

              return (
                <div
                  key={player.username}
                  className="grid grid-cols-12 gap-4 items-center px-5 py-4 rounded-lg bg-gradient-to-r from-purple-800/40 to-purple-800/20 border border-purple-400/30 hover:border-cyan-400/70 hover:bg-purple-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 animate-slide-in-left cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="col-span-2">
                    <span
                      className={`text-lg font-black ${
                        rank === 1
                          ? "text-yellow-400"
                          : rank === 2
                          ? "text-gray-300"
                          : rank === 3
                          ? "text-orange-400"
                          : "text-purple-400"
                      }`}
                    >
                      #{rank}
                    </span>
                  </div>

                  <div className="col-span-5">
                    <p className="text-white font-black text-base tracking-wide">
                      {player.username}
                    </p>
                  </div>

                  <div className="col-span-5 text-right">
                    <p className="text-white font-bold text-sm mb-1">
                      <span className="text-green-400">{player.gamesWon}W</span>
                      <span className="text-gray-400 mx-1">-</span>
                      <span className="text-red-400">{player.gamesLost}L</span>
                      {totalGames > 0 && (
                        <span className="text-gray-500 text-xs ml-2">
                          ({totalGames} games)
                        </span>
                      )}
                    </p>
                    <div className="h-1 bg-gradient-to-r from-green-400 to-red-400 rounded-full mb-1"></div>
                    <p className="text-xs text-purple-300 font-semibold">
                      {winRatePercent}% Win Rate
                    </p>
                  </div>
                </div>
              );
            })}
            {showFallback && (
              <p className="text-center text-xs text-purple-400 mt-3 italic">
                Be the first to play and claim your spot!
              </p>
            )}
          </div>
        )}

        <footer className="border-t border-purple-500/40 mt-8 pt-6 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/50"></div>
            <span className="text-purple-400 font-black text-lg">*</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/50"></div>
          </div>
          <p className="text-xs text-purple-300 italic text-center">
            Rise through the ranks and claim your place among the legends. Every victory brings you closer to the Diamond Belt.
          </p>
        </footer>
      </article>

      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-down { animation: fadeDown 0.6s ease-out; }
        .animate-fade-up { animation: fadeUp 0.7s ease-out 0.2s both; }
        .animate-slide-in-left { animation: slideInLeft 0.6s ease-out both; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out 1s both; }
      `}</style>
    </section>
  );
}