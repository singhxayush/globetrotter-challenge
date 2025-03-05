import {GameState} from "@/app/game/page";
import { ScanSearch, Timer, Users, Zap } from "lucide-react";
import { Button } from "../ui/button";

type GameMenuProps = {
  startGame: () => Promise<void>;
  gameState: GameState;
};

export default function GameMenu({startGame, gameState}: GameMenuProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4">
        Welcome to the Globetrotter Challenge!
      </h2>
      <p className="mb-6 text-gray-700">
        Test your knowledge of cities around the world with clues, fun facts,
        and trivia!
      </p>
      <div className="mb-8 grid grid-cols-2 gap-4 text-center">
        <div className="bg-blue-50 p-4 w-full gap-2 flex flex-col items-center justify-center rounded-lg">
          <Timer className="w-10 h-10 mb-2" />
          <p className="text-sm text-gray-700">15 minute challenge</p>
        </div>

        <div className="bg-blue-50 p-4 w-full gap-2 flex flex-col items-center justify-center rounded-lg">
          <ScanSearch className="w-10 h-10 mb-2" />
          <p className="text-sm text-gray-700">Solve clues</p>
        </div>

        <div className="bg-blue-50 p-4 w-full gap-2 flex flex-col items-center justify-center rounded-lg">
          <Zap className="w-10 h-10 mb-2" />
          <p className="text-sm text-gray-700">Build your streak</p>
        </div>

        <div className="bg-blue-50 p-4 w-full gap-2 flex flex-col items-center justify-center rounded-lg">
          <Users className="w-10 h-10 mb-2" />
          <p className="text-sm text-gray-700">Multiplayer mode</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-2">
        <Button
          onClick={startGame}
          disabled={gameState.loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2 w-[250px] rounded-md transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          {gameState.loading ? "Starting..." : "Start New Game"}
        </Button>
        <Button
          // onClick={startMultiplayerGame}
          // disabled={gameState.loading}
          disabled={true}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2 w-[250px] rounded-md transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          {gameState.loading ? "Starting..." : "New Multiplayer Game"}
        </Button>
      </div>
    </div>
  );
}
