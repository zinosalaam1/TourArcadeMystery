import { motion } from 'motion/react';
import { Trophy, X, PartyPopper, Frown } from 'lucide-react';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ResultModalProps {
  isWinner: boolean;
  username: string;
  remainingChances: number; // ← add remaining chances here
  onClose: () => void;
  onPlayAgain: () => void;
}

export function ResultModal({ isWinner, username, remainingChances, onClose, onPlayAgain }: ResultModalProps) {
  useEffect(() => {
    if (isWinner) {
      // Trigger confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        confetti({
          particleCount: 3,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors: ['#FFD700', '#FFA500', '#FF69B4', '#9370DB']
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isWinner]);

  const noChancesLeft = remainingChances <= 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 max-w-md w-full border-4 border-gray-700 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {noChancesLeft ? (
          <div className="text-center">
            <Frown className="w-24 h-24 text-red-500 mx-auto mb-4" />
            <h2 className="text-4xl mb-3 text-white">No More Attempts!</h2>
            <p className="text-xl text-gray-400 mb-6">{username}, you have used all your chances.</p>

            <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-red-500">
              <p className="text-white text-lg text-center">
                You cannot play again until the next round.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl transition-colors border border-gray-600"
            >
              Close
            </button>
          </div>
        ) : isWinner ? (
          <div className="text-center">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1, 1.1, 1] }}
              transition={{ duration: 0.6, repeat: 2 }}
              className="inline-block mb-4"
            >
              <Trophy className="w-24 h-24 text-yellow-400 mx-auto" />
            </motion.div>
            <h2 className="text-4xl mb-3 text-white">🎉 Congratulations! 🎉</h2>
            <p className="text-xl text-yellow-400 mb-2">{username}</p>
            <p className="text-lg text-gray-300 mb-6">You found a winning box!</p>

            <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-yellow-400/50">
              <PartyPopper className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <p className="text-white text-lg text-center">You are one of the lucky 5 winners!</p>
              <p className="text-gray-400 mt-2 text-center">Check your rewards in your account</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl transition-colors border border-gray-600"
              >
                Close
              </button>
              <button
                onClick={onPlayAgain}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black py-3 rounded-xl transition-all"
              >
                New Round
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Frown className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-4xl mb-3 text-white">Better Luck Next Time!</h2>
            <p className="text-xl text-gray-400 mb-2">{username}</p>
            <p className="text-lg text-gray-300 mb-6">This box was empty or rewards were already claimed</p>

            <div className="bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-600">
              <p className="text-white text-center">Don't worry! You'll have another chance.</p>
              <p className="text-gray-400 mt-2 text-center">Remaining attempts: {remainingChances}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl transition-colors border border-gray-600"
              >
                Close
              </button>
              <button
                onClick={onPlayAgain}
                className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white py-3 rounded-xl transition-all border border-gray-600"
              >
                New Round
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
