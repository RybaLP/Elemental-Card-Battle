import { useStore } from "@/hooks/useStore";
import { CardInStore } from "@/types/cardInStore";
import { usePurchaseCard } from "@/hooks/usePurchaseStore";

export default function StoreSection() {
  const { cards, isLoading, error, refresh } = useStore();

  if (isLoading) return <p className="text-gray-400">Loading store...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <section aria-labelledby="store-heading" className="py-8">
      <h2 id="store-heading" className="text-2xl font-bold text-white mb-6">
        Card Store
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <StoreCard key={card.id} card={card} onPurchaseSuccess={refresh} />
        ))}
      </div>
    </section>
  );
}

function StoreCard({
  card,
  onPurchaseSuccess,
}: {
  card: CardInStore;
  onPurchaseSuccess: () => void;
}) {
  const { buyCard, isPending, error } = usePurchaseCard(onPurchaseSuccess);

  return (
    <div className="bg-gray-800 rounded-xl p-4 flex flex-col items-center text-center shadow-lg">
      <img
        src={card.imageUrl}
        alt={card.name}
        className="w-full h-32 object-cover rounded-lg mb-3"
      />
      <h3 className="text-white font-bold text-lg">{card.name}</h3>
      <p className="text-yellow-400 text-sm mb-2">Power: {card.power}</p>
      <button
        onClick={() => buyCard(card.id)}
        disabled={isPending}
        className="mt-auto bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
      >
        {isPending ? "Buying..." : `Buy – ${card.price} Coins`}
      </button>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}