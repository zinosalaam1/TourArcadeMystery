import { Gift } from 'lucide-react';
import { motion } from 'motion/react';

interface MysteryBoxProps {
  boxNumber: number;
  isSelected: boolean;
  isRevealing: boolean;
  hasPlayed: boolean;
  onClick: () => void;
}

export function MysteryBox({ 
  boxNumber, 
  isSelected, 
  isRevealing, 
  hasPlayed,
  onClick 
}: MysteryBoxProps) {
  return (
    <motion.button
      type="button"   // ⬅️ Important for integration with modals & forms
      onClick={onClick}
      disabled={hasPlayed || isRevealing}
      className={`
        relative w-full aspect-square min-h-[60px] min-w-[60px] rounded-lg md:rounded-xl border-2 md:border-3 
        transition-all duration-300 
        ${isSelected 
          ? 'border-yellow-400 shadow-xl shadow-yellow-400/50 scale-105 z-10' 
          : 'border-gray-700 hover:border-yellow-500/60 hover:scale-105'
        }
        ${hasPlayed && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isRevealing ? 'cursor-wait' : ''}
        bg-gradient-to-br from-gray-800 to-gray-900
        overflow-hidden
      `}
      whileHover={!hasPlayed && !isRevealing ? { y: -4 } : {}}
      whileTap={!hasPlayed && !isRevealing ? { scale: 0.95 } : {}}
      animate={isRevealing ? {
        rotateY: [0, 180, 360],
        scale: [1, 1.1, 1]
      } : {}}
      transition={{ duration: 0.6 }}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Gift Icon */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-1">
        <Gift 
          className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 mb-0.5 md:mb-1 text-yellow-400 ${isRevealing ? 'animate-bounce' : ''}`} 
        />
        <span className="text-[10px] sm:text-xs md:text-sm">{boxNumber}</span>
      </div>

      {/* Glow on hover */}
      {!hasPlayed && !isRevealing && (
        <div className="absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-br from-yellow-400/0 via-yellow-400/0 to-yellow-400/0 group-hover:from-yellow-400/20 group-hover:via-transparent group-hover:to-yellow-400/10 transition-all duration-500" />
      )}

      {/* Floating question mark */}
      {!isSelected && !hasPlayed && (
        <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1">
          <motion.span
            className="text-xs sm:text-sm md:text-base lg:text-xl text-yellow-400"
            animate={{
              y: [0, -3, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ?
          </motion.span>
        </div>
      )}
    </motion.button>
  );
}
