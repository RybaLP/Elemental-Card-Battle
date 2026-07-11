"use client";
import { useProfile } from "@/hooks/useProfileDto";

export default function ProfileSection() {
  const { profile, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-400 text-center py-8">{error}</p>;
  }

  if (!profile) {
    return <p className="text-gray-400 text-center py-8">No profile data available.</p>;
  }

  const winRate =
    profile.gamesWon + profile.gamesLost > 0
      ? ((profile.gamesWon / (profile.gamesWon + profile.gamesLost)) * 100).toFixed(1)
      : "0.0";

  return (
    <section className="w-full max-w-6xl my-16">
      {/* Header */}
      <header className="mb-10 animate-fade-down">
        <h2 className="text-3xl font-black text-white mb-2 tracking-widest">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            YOUR PROFILE
          </span>
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-transparent animate-pulse"></div>
      </header>

      {/* Stats Container */}
      <article className="rounded-xl border-2 border-purple-500/80 bg-gradient-to-b from-purple-900/80 to-purple-900/50 p-8 backdrop-blur-md shadow-2xl shadow-purple-900/50 mb-12 animate-fade-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label="Games Won" 
            value={profile.gamesWon}
            icon="🏆"
            index={0}
          />
          <StatCard 
            label="Games Lost" 
            value={profile.gamesLost}
            icon="⚔️"
            index={1}
          />
          <StatCard 
            label="Win Rate" 
            value={`${winRate}%`}
            icon="⭐"
            index={2}
          />
        </div>
      </article>

      {/* Cards Section */}
      <header className="mb-8 animate-fade-down">
        <h3 className="text-3xl font-black text-white mb-2 tracking-widest">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            YOUR CARDS
          </span>
        </h3>
        <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-transparent animate-pulse"></div>
      </header>

      {/* Cards Container */}
      <article className="rounded-xl border-2 border-purple-500/80 bg-gradient-to-b from-purple-900/80 to-purple-900/50 p-8 backdrop-blur-md shadow-2xl shadow-purple-900/50 animate-fade-up">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {profile.ownedCards.map((card, index) => (
            <div 
              key={card.id}
              className="rounded-lg bg-gradient-to-br from-purple-800/40 to-purple-800/20 border border-purple-400/30 hover:border-cyan-400/70 p-4 flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105 animate-slide-in-left cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <img 
                src={card.imageUrl} 
                alt={card.name} 
                className="w-full h-28 object-cover rounded-lg border border-purple-400/20 mb-3"
              />
              <h4 className="text-white text-sm font-black tracking-wider">
                {card.name}
              </h4>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {profile.ownedCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-purple-300 text-lg font-semibold mb-2">No cards yet</p>
            <p className="text-gray-400 text-sm">Visit the Card Store to start building your collection!</p>
          </div>
        )}

        {/* Footer Info */}
        <footer className="border-t border-purple-500/40 mt-8 pt-6 animate-fade-in">
          <p className="text-xs text-purple-300 italic text-center">
            Total Cards Collected: <span className="text-cyan-400 font-black">{profile.ownedCards.length}</span>
          </p>
        </footer>
      </article>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-down {
          animation: fadeDown 0.6s ease-out;
        }

        .animate-fade-up {
          animation: fadeUp 0.7s ease-out 0.2s both;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out both;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out 1s both;
        }
      `}</style>
    </section>
  );
}

function StatCard({ 
  label, 
  value, 
  icon,
  index
}: { 
  label: string
  value: string | number
  icon: string
  index: number
}) {
  return (
    <div 
      className="rounded-lg bg-gradient-to-br from-purple-800/40 to-purple-800/20 border border-purple-400/30 hover:border-cyan-400/70 p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105 animate-slide-in-left"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Icon */}
      <span className="text-4xl mb-4 animate-bounce" style={{ animationDelay: `${index * 0.1}s` }}>
        {icon}
      </span>

      {/* Label */}
      <p className="text-purple-300 text-xs uppercase font-black tracking-widest mb-3">
        {label}
      </p>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-3"></div>

      {/* Value */}
      <p className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        {value}
      </p>
    </div>
  );
}