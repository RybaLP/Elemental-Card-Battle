import Image from "next/image";
import { WonRound } from "@/types/wonRound";

interface Props {
  wonRounds: WonRound[];
}

const WonRounds = ({ wonRounds }: Props) => {
  if (wonRounds.length === 0) return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-20 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
        <span className="text-gray-500 text-sm">0</span>
      </div>
    </div>
  );

  const groups = {
    FIRE: wonRounds.filter(r => r.elementalType === "FIRE"),
    WATER: wonRounds.filter(r => r.elementalType === "WATER"),
    ICE: wonRounds.filter(r => r.elementalType === "ICE"),
  };

  const order = ["FIRE", "WATER", "ICE"] as const;
  console.log("WATER IMAGES:", groups.WATER.map(r => r.imageUrl));

  return (
    
    <div className="flex items-end gap-2"> 
      {order.map(type => (
        
        groups[type].length > 0 && (
          
          <div key={type} className="flex flex-col items-center">
             <div className="flex items-end">
                {groups[type].map((round, index) => (
                  <div
                    key={index}
                    className="relative transition-all duration-300 hover:z-10 hover:scale-110"
                    style={{
                      marginLeft: index === 0 ? 0 : -20, 
                      zIndex: groups[type].length - index, 
                    }}
                  >
                    
                      <Image
                        src={round.imageUrl}
                        alt={`${type} won round`}
                        width={80}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                  </div>
                ))}
             </div>
             
          </div>
        )
      ))}
    </div>
  );
};

export default WonRounds;