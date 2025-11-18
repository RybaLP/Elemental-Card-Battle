import { Player } from "@/types/player"

interface Props {
  player: Player;
}

const PlayerSlot = ({ player}: Props) => {
  return (
    <div className={`w-full aspect-square max-w-[280px] mx-auto rounded-2xl p-6 
                    border-2 
                    bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl 
                    transform transition-all duration-300 hover:scale-[1.02]`}>
      
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 
                     flex items-center justify-center text-white text-2xl font-bold shadow-lg">
        {player.nickname.charAt(0).toUpperCase()}
      </div>
      
      <h3 className="text-xl font-bold text-white text-center mb-2 truncate">
        {player.nickname}
      </h3>
      
      <div className="text-center space-y-2">
        
        <div className="text-green-400 text-sm flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          Ready
        </div>
      </div>
    </div>
  )
}

export default PlayerSlot;