import {GameState} from "@/app/game/page";
import {Button} from "../ui/button";
import {CircleX} from "lucide-react";

type ResultCardProps = {
  gameState: GameState;
  startGame: () => Promise<void>;
};

export default function ResultCard({gameState, startGame}: ResultCardProps) {
  const handleEndGame = async () => {
    // Full page refresh
    window.location.href = "/game";
  };

  return (
    <div className="h-full w-full flex flex-col bg-white py-10 items-center justify-center relative">
      <CircleX
        onClick={handleEndGame}
        className="absolute top-2 right-2 w-6 h-6 cursor-pointer hover:text-destructive rounded-full hover:bg-red-500/10"
      />

      <h2 className="text-2xl font-bold mb-4">Game Completed!</h2>

      <div className="relative mb-8 mx-auto w-48 h-48">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-blue-600">
            {gameState.stats ? Math.round(gameState.stats.score * 100) : 0}%
          </span>
        </div>
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeDasharray={`${
              gameState.stats ? gameState.stats.score * 100 : 0
            }, 100`}
            strokeLinecap="round"
          />
        </svg>
      </div>

      <p className="mb-6 text-lg text-gray-700">
        You got{" "}
        <span className="font-bold text-blue-600">
          {gameState.stats?.totalCorrect}
        </span>{" "}
        out of {gameState.stats?.totalAnswered} questions correct.
      </p>
      <div className="flex justify-center space-x-4">
        <Button
          onClick={startGame}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Play Again
        </Button>
      </div>
    </div>
  );
}
