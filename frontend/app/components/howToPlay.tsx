import Image from "next/image";

export default function HowToPlay() {
  const elementRules = [
    {
      element: "Fire",
      image: "/fire.png",
      beats: "Ice",
      description: "The burning power of flames melts through icy defenses. Fire is fierce, aggressive, and overwhelming."
    },
    {
      element: "Ice",
      image: "/ice.png",
      beats: "Water",
      description: "Frozen wisdom immobilizes flowing waters. Ice is calm, strategic, and controlling."
    },
    {
      element: "Water",
      image: "/water.png",
      beats: "Fire",
      description: "The fluidity of water extinguishes roaring flames. Water is adaptable, flowing, and defensive."
    }
  ];

  return (
    <section className="w-full max-w-4xl my-16">
      {/* Header with Animation */}
      <header className="mb-8 animate-fade-down">
        <h2 className="text-3xl font-black text-white mb-2 tracking-widest">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            HOW TO PLAY
          </span>
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-transparent animate-pulse"></div>
      </header>

      {/* Main Container with Solid Border */}
      <article className="rounded-xl border-2 border-purple-500/80 bg-gradient-to-b from-purple-900/80 to-purple-900/50 p-8 backdrop-blur-md shadow-2xl shadow-purple-900/50 animate-fade-up">
        
        {/* Introduction */}
        <header className="mb-8 pb-6 border-b border-purple-500/40 animate-slide-in-left">
          <p className="text-gray-300 leading-relaxed mb-4 text-sm">
            CardJitsu is a strategic card-battling game inspired by the legendary martial arts traditions of Club Penguin's Card-Jitsu. Master the elemental powers, understand the balance of nature, and rise to become a true Card Warrior. The ancient order of warriors has passed down this sacred art for generations—now it's your turn to claim your place in history.
          </p>
          <p className="text-gray-400 text-xs italic border-l-2 border-cyan-400/50 pl-4">
            "Just like in the original Club Penguin game, every warrior must learn that no single element reigns supreme—victory comes from understanding your opponent, adapting your strategy, and knowing when to strike."
          </p>
        </header>

        {/* Element Rules */}
        <section className="mb-8">
          <h3 className="text-lg font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-6 uppercase tracking-wider">
            The Elemental Cycle
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {elementRules.map((rule, index) => (
              <article
                key={index}
                className="p-5 rounded-lg bg-gradient-to-br from-purple-800/40 to-purple-800/20 border border-purple-400/30 hover:border-cyan-400/70 hover:bg-purple-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 animate-slide-in-left cursor-pointer flex flex-col items-center text-center"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Element Image */}
                <div className="mb-4 hover:scale-110 transition-transform duration-300">
                  <Image
                    src={rule.image}
                    alt={rule.element}
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                </div>

                {/* Element Title */}
                <div className="mb-4">
                  <h4 className="text-white font-black tracking-wider">{rule.element}</h4>
                  <p className="text-xs text-cyan-300 font-semibold">beats {rule.beats}</p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent w-full mb-3"></div>

                {/* Description */}
                <p className="text-sm text-gray-300 leading-relaxed">
                  {rule.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Game Mechanics */}
        <section className="mb-8">
          <h3 className="text-lg font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-6 uppercase tracking-wider">
            Core Mechanics
          </h3>
          
          <ul className="space-y-4 list-none">
            {[
              {
                title: "Draw Your Hand",
                desc: "Each turn, you draw cards from your deck. Choose wisely which cards to play and when to play them."
              },
              {
                title: "Predict Your Opponent",
                desc: "CardJitsu rewards tactical thinking. Anticipate what your opponent will play and counter their strategy."
              },
              {
                title: "Master All Elements",
                desc: "A true warrior doesn't rely on a single element. Diversify your deck and adapt to any opponent's playstyle."
              },
              {
                title: "Climb the Ranks",
                desc: "Win battles to earn experience, unlock rare cards, and climb the global leaderboard. Every victory brings you closer to becoming a legend."
              }
            ].map((mechanic, index) => (
              <li
                key={index}
                className="flex gap-4 p-4 rounded-lg bg-gradient-to-r from-purple-800/40 to-purple-800/20 border border-purple-400/20 hover:border-cyan-400/50 transition-all duration-200 animate-slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex-shrink-0">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h4 className="text-white font-black mb-1 tracking-wider">{mechanic.title}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{mechanic.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Legacy Note */}
        <footer className="border-t border-purple-500/40 pt-6 mt-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/50"></div>
            <span className="text-purple-400 font-black text-lg">✦</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/50"></div>
          </div>
          <p className="text-xs text-purple-300 italic text-center leading-relaxed">
            Season 1 celebrates the timeless spirit of Club Penguin's Card-Jitsu—a game where strategy, patience, and understanding of the elemental balance determine true mastery. Whether you're a returning warrior or a new initiate, the path to Card Warrior awaits.
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