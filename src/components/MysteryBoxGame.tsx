import { useState } from "react";
import { MysteryBox } from "./MysteryBox";
import { ResultModal } from "./ResultModal";
import { UsernameInput } from "./UsernameInput";
import { Gift, User } from "lucide-react";

const TOTAL_BOXES = 200;
const WIN_PROBABILITY = 0; // 10% chance to win
const MAX_CHANCES = 3; // ← limit to 3 attempts

export function MysteryBoxGame() {
  const [username, setUsername] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const [remainingChances, setRemainingChances] = useState(MAX_CHANCES);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);

  const [showResult, setShowResult] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const handleBoxClick = (index: number) => {
    if (remainingChances <= 0 || isRevealing) return; // block if no chances left

    setSelectedBox(index);
    setIsRevealing(true);

    setTimeout(() => {
      const winRoll = Math.random();
      const won = winRoll < WIN_PROBABILITY;

      setIsWinner(won);
      setShowResult(true);
      setIsRevealing(false);

      // reduce remaining chances
      setRemainingChances(prev => prev - 1);
    }, 1500);
  };

  const handleCloseResult = () => setShowResult(false);

  const handlePlayAgain = () => {
    setSelectedBox(null);
    setShowResult(false);
    // Do not reset remainingChances unless you want a full reset
  };

  const handleStartGame = (name: string) => {
    setUsername(name);
    setGameStarted(true);
    setRemainingChances(MAX_CHANCES); // reset chances at start
  };

  if (!gameStarted) {
    return <UsernameInput onSubmit={handleStartGame} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl mb-4 text-white flex items-center gap-3 justify-center">
          <Gift className="w-12 h-12 text-yellow-400" />
          Mystery Box Challenge
        </h1>

        <div className="flex items-center justify-center gap-2 text-yellow-400 mt-4">
          <User className="w-5 h-5" />
          <span className="text-lg">
            Playing as: {username} | Remaining chances: {remainingChances}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-3 mb-8 w-full max-w-7xl px-4">
        {Array.from({ length: TOTAL_BOXES }, (_, i) => (
          <MysteryBox
            key={i}
            boxNumber={i + 1}
            isSelected={selectedBox === i}
            isRevealing={isRevealing && selectedBox === i}
            hasPlayed={remainingChances === 0} // disable boxes when no chances left
            onClick={() => handleBoxClick(i)}
          />
        ))}
      </div>

      {showResult && (
        <ResultModal
          isWinner={isWinner}
          username={username}
          onClose={handleCloseResult}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
