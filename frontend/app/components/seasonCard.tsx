import Image from "next/image";

export default function SeasonCard() {
  return (
    <section className="w-full max-w-4xl my-16">
      {/* Header */}
      <header className="mb-8 animate-fade-down">
        <h2 className="text-3xl font-black text-white mb-2 tracking-widest">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            SEASON 1 REWARDS
          </span>
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-transparent animate-pulse"></div>
      </header>

      {/* Main Container */}
      <article className="rounded-xl border-2 border-purple-500/80 bg-gradient-to-b from-purple-900/80 to-purple-900/50 p-8 backdrop-blur-md shadow-2xl shadow-purple-900/50 animate-fade-up">
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Left - Card Image */}
          <div className="flex justify-center animate-slide-in-left">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur-xl opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
              
              {/* Card Image */}
              <div className="relative">
                <Image
                  src="/season-card.png"
                  alt="Season 1 Legendary Card"
                  width={280}
                  height={380}
                  className="rounded-lg border-2 border-cyan-400/50 group-hover:border-cyan-400 transition-all duration-300 group-hover:scale-105 transform"
                />
              </div>
            </div>
          </div>

          {/* Right - Description */}
          <div className="animate-slide-in-right">
            <div className="mb-6">
              <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-3">
                Legendary Season 1 Card
              </h3>
              <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-transparent"></div>
            </div>

            {/* Description Text */}
            <div className="space-y-4 mb-8">
              <p className="text-gray-300 leading-relaxed">
                The strongest warriors of Season 1 will be immortalized forever. Only the top 5 players with the highest win rate at the end of the season will receive this exclusive legendary card.
              </p>
              
              <div className="bg-purple-800/40 border border-purple-400/30 rounded-lg p-5">
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                  This card represents the pinnacle of CardJitsu mastery and can only be obtained by proving your dominance on the battlefield. Will you be among the elite chosen few?
                </p>
              </div>
            </div>

            {/* Top 5 Requirements */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-cyan-400 uppercase tracking-widest">
                Top 5 Eligibility
              </h4>
              
              <ul className="space-y-2 list-none">
                {[
                  "Highest Win Rate (1st - 5th Place)",
                  "Minimum 10 battles played",
                  "Active throughout Season 1",
                  "Card awarded after season ends",
                  "Unique variant for each rank"
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-sm text-gray-300 animate-slide-in-left"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-cyan-400 font-black">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

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

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
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

        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out 0.2s both;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out 1s both;
        }
      `}</style>
    </section>
  );
}