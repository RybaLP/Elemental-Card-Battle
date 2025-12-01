import Image from "next/image";
import { WonRound } from "@/types/wonRound";

interface Props {
  wonRounds: WonRound[];
}

const WonRounds = ({ wonRounds }: Props) => {
  if (wonRounds.length === 0) return null;

  const groups = {
    FIRE: wonRounds.filter(r => r.elementalType === "FIRE"),
    WATER: wonRounds.filter(r => r.elementalType === "WATER"),
    ICE: wonRounds.filter(r => r.elementalType === "ICE"),
  };

  const order = ["FIRE", "WATER", "ICE"] as const;

  return (
    <div className="flex items-end gap-3">
      {order.map(type => (
        groups[type].length > 0 && (
          <div key={type} className="flex">
            {groups[type].map((round, i) => (
              <div
                key={i}
                className="relative w-[180px] h-[230px]"
                style={{
                  marginLeft: i === 0 ? 0 : -20, 
                  zIndex: i,                     
                }}
              >
                <Image
                  src={round.imageUrl} 
                  alt={`${type} icon`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        )
      ))}
    </div>
  );
};

export default WonRounds;