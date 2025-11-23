import { useState, useEffect } from "react";
import { MysteryBox } from "./MysteryBox";
import { ResultModal } from "./ResultModal";
import { UsernameInput } from "./UsernameInput";
import { Gift, User } from "lucide-react";
import axios from "axios";

const TOTAL_BOXES = 50;
const WIN_PROBABILITY = 0.10; // for random frontend fallback
const API_BASE = import.meta.env.VITE_API_BASE;

export function MysteryBoxGame() {
  const [username, setUsername] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [remainingChances, setRemainingChances] = useState(0);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const handleStartGame = async (name: string) => {
    try {
      const res = await axios.post(`${API_BASE}/api/register`, { username: name });
      setUsername(name);
      setRemainingChances(res.data.remainingChances);
      setGameStarted(true);
    } catch (err) {
      console.error(err);
      alert("Cannot connect to server.");
    }
  };

  const handleBoxClick = async (index: number) => {
    if (remainingChances <= 0 || isRevealing) return;

    setSelectedBox(index);
    setIsRevealing(true);

    try {
      const res = await axios.post(`${API_BASE}/api/select-box`, {
        username,
        boxNumber: index + 1
      });

      setIsWinner(res.data.reward);
      setRemainingChances(res.data.remainingChances);
      setShowResult(true);
    } catch (err) {
      console.error(err);
      alert("Error selecting box.");
    } finally {
      setIsRevealing(false);
    }
  };

  const handleCloseResult = () => setShowResult(false);
  const handlePlayAgain = () => setSelectedBox(null);

  if (!gameStarted) return <UsernameInput onSubmit={handleStartGame} />;

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
            hasPlayed={remainingChances === 0}
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
