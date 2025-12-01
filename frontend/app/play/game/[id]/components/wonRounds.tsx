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
                      <div className="absolute bottom-1 right-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                          ${type === "FIRE" ? "bg-red-500" :
                            type === "WATER" ? "bg-blue-500" : "bg-cyan-400"}`}
                        >
                          {type === "FIRE" ? "🔥" : 
                           type === "WATER" ? "💧" : "❄️"}
                        </div>
                      </div>
                    
                  </div>
                ))}
             </div>
             
             <div className="mt-2 text-center">
               <span className={`text-xs font-bold px-2 py-1 rounded-full
                 ${type === "FIRE" ? "bg-red-500/20 text-red-300" :
                   type === "WATER" ? "bg-blue-500/20 text-blue-300" :
                   "bg-cyan-500/20 text-cyan-300"}`}
               >
                 {groups[type].length} {type}
               </span>
             </div>
          </div>
        )
      ))}
    </div>
  );
};

export default WonRounds;