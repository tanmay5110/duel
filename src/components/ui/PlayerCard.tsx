import { Player } from '../../types/game.types';
import { motion } from 'framer-motion';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
}

export default function PlayerCard({ player, isActive }: PlayerCardProps) {
  const cardClass = player.gender === 'male' ? 'player-card-male' : 'player-card-female';

  return (
    <motion.div
      animate={{
        scale: isActive ? 1.05 : 1,
        boxShadow: isActive 
          ? '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)'
          : '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
      }}
      className={`${cardClass} relative transition-all duration-300 ${
        isActive ? 'ring-4 ring-rose-400' : ''
      }`}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        {/* Avatar */}
        <div className="text-4xl sm:text-5xl">
          {player.gender === 'male' ? '�' : '�'}
        </div>

        {/* Name */}
        <h3 className="text-lg sm:text-xl font-bold truncate w-full px-2">{player.name}</h3>
      </div>

      {/* Active Indicator Line */}
      {isActive && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-rose-400 to-red-600"
        />
      )}
    </motion.div>
  );
}
