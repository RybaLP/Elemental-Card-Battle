"use client";

import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { usePurchaseCard } from "@/hooks/usePurchaseStore";
import { CardInStore } from "@/types/cardInStore";
import { usePlayerStore } from "@/store/usePlayerStore";

const CARDS_PER_PAGE = 6;

export default function StoreSection() {
  const { cards, isLoading, error, refresh } = useStore();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <p className="text-gray-400 text-center py-8">Loading store...</p>;
  if (error) return <p className="text-red-400 text-center py-8">{error}</p>;

  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const paginatedCards = cards.slice(startIndex, startIndex + CARDS_PER_PAGE);

  return (
    <section aria-labelledby="store-heading" className="py-8 w-full max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-10 animate-fade-down">
        <h2 
          id="store-heading" 
          className="text-3xl font-black text-white mb-2 tracking-widest"
        >
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            CARD STORE
          </span>
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-transparent animate-pulse"></div>
      </header>

      {/* Cards Container */}
      <article className="rounded-xl border-2 border-purple-500/80 bg-gradient-to-b from-purple-900/80 to-purple-900/50 p-8 backdrop-blur-md shadow-2xl shadow-purple-900/50 animate-fade-up">
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {paginatedCards.map((card, index) => (
            <StoreCard 
              key={card.id} 
              card={card} 
              onPurchaseSuccess={refresh}
              index={index}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <footer className="border-t border-purple-500/40 pt-8 animate-fade-in">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-6 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 border border-purple-400/30"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all duration-200 border ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-cyan-400 to-purple-400 text-black border-cyan-400/50"
                        : "bg-purple-700/40 text-white border-purple-400/30 hover:border-cyan-400/50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-6 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 border border-purple-400/30"
              >
                Next →
              </button>
            </div>

            <p className="text-center text-sm text-purple-300 mt-4">
              Page {currentPage} of {totalPages}
            </p>
          </footer>
        )}
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

function StoreCard({
  card,
  onPurchaseSuccess,
  index,
}: {
  card: CardInStore;
  onPurchaseSuccess: () => void;
  index: number;
}) {
  const { buyCard, isPending, error } = usePurchaseCard(onPurchaseSuccess);
  const player = usePlayerStore((state) => state.player);
  const [showConfirm, setShowConfirm] = useState(false);

  const hasEnoughCoins = player && player.currency >= card.price;

  const handleBuyClick = () => {
    if (hasEnoughCoins) {
      setShowConfirm(true);
    }
  };

  const handleConfirmBuy = async () => {
    setShowConfirm(false);
    await buyCard(card.id);
  };

  return (
    <>
      <div 
        className="rounded-lg bg-gradient-to-br from-purple-800/40 to-purple-800/20 border border-purple-400/30 hover:border-cyan-400/70 p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105 animate-slide-in-left"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Card Image */}
        <img
          src={card.imageUrl}
          alt={card.name}
          className="w-full h-48 object-cover rounded-lg mb-4 border border-purple-400/20"
        />

        {/* Card Name */}
        <h3 className="text-white font-black text-lg mb-4 tracking-wider">
          {card.name}
        </h3>

        {/* Buy Button */}
        <button
          onClick={handleBuyClick}
          disabled={isPending || !hasEnoughCoins}
          className={`mt-auto w-full font-black py-3 px-4 rounded-lg transition-all duration-200 border uppercase tracking-wider text-sm ${
            hasEnoughCoins
              ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black cursor-pointer border-yellow-400/30 hover:border-yellow-300/50"
              : "bg-gray-600 text-gray-300 cursor-not-allowed border-gray-500/30"
          }`}
        >
          {isPending ? "Buying..." : `Buy — ${card.price} Coins`}
        </button>

        {/* Insufficient Coins Message */}
        {!hasEnoughCoins && (
          <p className="text-red-400 text-xs mt-3 font-semibold">
            Insufficient coins
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-xs mt-3 font-semibold">{error}</p>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <PurchaseConfirmModal
          card={card}
          onConfirm={handleConfirmBuy}
          onCancel={() => setShowConfirm(false)}
          isPending={isPending}
        />
      )}
    </>
  );
}

function PurchaseConfirmModal({
  card,
  onConfirm,
  onCancel,
  isPending,
}: {
  card: CardInStore;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <article className="rounded-xl border-2 border-purple-500/80 bg-gradient-to-b from-purple-900/95 to-purple-900/90 p-8 max-w-sm w-full shadow-2xl shadow-purple-900/80 animate-fade-up">
        
        {/* Header */}
        <header className="mb-6">
          <h2 className="text-2xl font-black text-white mb-2 tracking-wider">
            Confirm Purchase
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-transparent"></div>
        </header>

        {/* Content */}
        <section className="mb-8">
          <p className="text-gray-300 mb-4 leading-relaxed">
            Are you sure you want to buy
          </p>
          <p className="text-2xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-6">
            {card.name}
          </p>
          <div className="bg-purple-800/40 border border-purple-400/30 rounded-lg p-4 mb-6">
            <p className="text-gray-300 text-sm mb-2">
              Cost: <span className="text-yellow-400 font-black">{card.price} Coins</span>
            </p>
            <p className="text-red-400 text-xs italic font-semibold">
               Refunds are forbidden. This purchase is final.
            </p>
          </div>
        </section>

        {/* Buttons */}
        <footer className="flex gap-4">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 px-4 py-3 rounded-lg font-black text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 transition-all duration-200 disabled:opacity-50 border border-gray-400/30 uppercase tracking-wider text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-3 rounded-lg font-black text-black bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-yellow-400/30 hover:border-yellow-300/50 uppercase tracking-wider text-sm"
          >
            {isPending ? "Buying..." : "Confirm"}
          </button>
        </footer>
      </article>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-fade-up {
          animation: fadeUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}