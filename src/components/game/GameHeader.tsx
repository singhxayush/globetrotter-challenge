// Header Component

import {GameProgress, GameStats} from "@/app/(game)/play/page";
import {Hourglass} from "lucide-react";
import SubmitOrRestart from "./SubmitOrRestart";
import {cn} from "@/lib/utils";

type GameHeaderProps = {
  progress: GameProgress | null;
  stats: GameStats | null;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
  startGame: () => Promise<void>;
  handleEndGame: () => Promise<void>;
};

export function GameHeader({
  progress,
  stats,
  timeRemaining,
  formatTime,
  startGame,
  handleEndGame,
}: GameHeaderProps) {
  return (
    <div className="p-4 mt-2 flex items-center justify-between border-b border-gray-200">
      <div className="flex md:justify-start justify-between w-full gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Question {progress?.current} of {progress?.total}
          </span>
        </div>

        <span className="border-b md:border-b-0 md:border-r border-gray-300 hidden md:block" />

        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium bg-blue-50 text-blue-700 px-2 rounded-md">
            Score: {stats ? Math.round(stats.score * 100) : 0}%
          </span>
          <span className="border-b h-full md:border-b-0 md:border-r border-gray-300 hidden md:block"></span>
          <span className="text-sm flex items-center gap-1 text-gray-500">
            <Hourglass
              className={cn(
                "w-5 h-5 motion-preset-seesaw-sm text-green-500",
                timeRemaining < 60 &&
                  "text-red-500 motion-preset-seesaw-md rounded-sm",
                timeRemaining < 300 &&
                  "text-orange-500 motion-preset-seesaw-md rounded-sm"
              )}
            />
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      <div className="hidden md:block">
        <SubmitOrRestart startGame={startGame} handleEndGame={handleEndGame} />
      </div>
    </div>
  );
}
