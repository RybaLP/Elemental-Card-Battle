import { ActiveSession } from "@/types/activeSession";

interface Props {
  player: ActiveSession;
}

const PlayerSlot = ({ player }: Props) => {
  const isBot = player.userId !== null && player.userId < 0;

  return (
    <div className="w-full aspect-square max-w-[280px] mx-auto rounded-2xl p-6 
                    border-2 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl 
                    transform transition-all duration-300 hover:scale-[1.02]">
      
      <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center 
                     text-white text-2xl font-bold shadow-lg
                     ${isBot ? 'bg-gradient-to-r from-red-500 to-orange-500' : 
                              'bg-gradient-to-r from-purple-500 to-blue-500'}`}>
        {player.nickname?.charAt(0).toUpperCase() ?? "?"}
      </div>
      
      <h3 className="text-xl font-bold text-white text-center mb-2 truncate">
        {player.nickname}
        {isBot && <span className="ml-1 text-xs text-gray-400">(Bot)</span>}
      </h3>
      
      <div className="text-center">
        <div className="text-green-400 text-sm flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          Ready
        </div>
      </div>
    </div>
  );
};

export default PlayerSlot;