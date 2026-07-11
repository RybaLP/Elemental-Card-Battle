export default function NewsSection() {
  const articles = [
    {
      title: "Season 1 Tournament Begins",
      date: "Today",
      excerpt: "The Grand Tournament gates have officially opened to all challengers. Players from across the realm are gathering to test their elemental powers in the most prestigious competition of the age. This season promises unprecedented rewards and legendary cards for those who rise to the challenge. The tournament brackets are now live, and the first round matches commence at dawn."
    },
    {
      title: "Master Sensei's Arrival",
      date: "Yesterday",
      excerpt: "The legendary Master Sensei has arrived at the tournament grounds with a gift for the community - the rare and coveted Fire Phoenix card. Rumored to be one of the most powerful cards ever created, it channels the essence of eternal flames. This ancient artifact will be available for a limited time only to the most dedicated collectors and warriors who prove their worth in the arena."
    },
    {
      title: "New Arena: Frozen Wasteland",
      date: "3 Days Ago",
      excerpt: "Challenge yourself in the treacherous Frozen Wasteland Arena, a new battleground filled with untold dangers and mysteries. Tougher opponents await, but the rewards are worthy of the struggle. Rise through the ranks and unlock exclusive cards that are only available in this harsh battleground. Legends say that warriors who master this arena become immortal in the annals of CardJitsu history."
    }
  ];

  return (
    <section className="w-full max-w-4xl my-16">
      {/* Header with Animation */}
      <header className="mb-8 animate-fade-down">
        <h2 className="text-3xl font-black text-white mb-2 tracking-widest">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            NEWS
          </span>
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-transparent animate-pulse"></div>
      </header>

      {/* Container with Solid Border */}
      <article className="rounded-xl border-2 border-purple-500/80 bg-gradient-to-b from-purple-900/80 to-purple-900/50 p-8 backdrop-blur-md shadow-2xl shadow-purple-900/50 animate-fade-up">
        
        {/* Articles List */}
        <div className="space-y-4">
          {articles.map((article, index) => (
            <article
              key={index}
              className="p-5 rounded-lg bg-gradient-to-r from-purple-800/40 to-purple-800/20 border border-purple-400/30 hover:border-cyan-400/70 hover:bg-purple-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 animate-slide-in-left cursor-pointer"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Title with Gradient */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text tracking-wide">
                  {article.title}
                </h3>
                <span className="text-xs text-purple-400 font-semibold ml-4 flex-shrink-0">
                  {article.date}
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent mb-3"></div>

              {/* Excerpt */}
              <p className="text-gray-300 leading-relaxed text-sm font-light">
                {article.excerpt}
              </p>
            </article>
          ))}
        </div>

        {/* Footer */}
        <footer className="border-t border-purple-500/40 mt-8 pt-6 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/50"></div>
            <span className="text-purple-400 font-black text-lg">✦</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/50"></div>
          </div>
          <p className="text-xs text-purple-300 italic text-center leading-relaxed">
            Stay tuned for more updates throughout the season. New challenges, legendary rewards, and untold adventures await those brave enough to answer the call of CardJitsu.
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