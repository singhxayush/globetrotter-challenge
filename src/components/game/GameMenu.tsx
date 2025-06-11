"use client";

import {cn} from "@/lib/utils";
import {IoIosArrowBack} from "react-icons/io";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Image from "next/image";
import {CgSpinner} from "react-icons/cg";

enum GameOpt {
  QUIZ = "quiz",
  MAP = "map",
}

enum GameMode {
  SINGLE = "single",
  MULTI = "multi",
}

interface GameState {
  gameOpt: GameOpt | null;
  gameMode: GameMode | null;
}

const INITIAL_GAME_STATE = {
  gameOpt: null,
  gameMode: null,
};

export default function GameMenu() {
  const router = useRouter();
  const [isGameStarting, setGameStarting] = useState<boolean>(false);
  const [state, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  useEffect(() => {
    console.log(state);
  }, [state]);

  const handleOptionClick = (option: GameOpt) => {
    setGameState((prev) => ({
      ...prev,
      gameOpt: option,
    }));
  };

  const handleModeClick = (mode: GameMode) => {
    if (selectedMode === null && !isGameStarting) {
      setGameStarting(true);
      setSelectedMode(mode);
      setGameState((prev) => ({
        ...prev,
        gameMode: mode,
      }));

      if (mode === GameMode.SINGLE) {
        
        router.push("/play");
      } else if (mode === GameMode.MULTI) {
      }
      setGameStarting(false);
    }
  };

  const handleBackButton = () => {
    setGameStarting(false);
    setSelectedMode(null);
    setGameState(INITIAL_GAME_STATE);
  };

  return (
    <div className="w-auto h-full flex flex-col items-end md:items-start pt-[90px] gap-2 p-4">
      <div
        onClick={handleBackButton}
        className={cn(
          "w-full flex items-center justify-between rounded-sm text-sm px-2 gap-2",
          state.gameOpt !== null && "cursor-default"
        )}
      >
        <h1>{state.gameOpt !== null ? "Mode:" : "Options:"}</h1>
        {state.gameOpt !== null && (
          <span className="flex items-center cursor-pointer hover:bg-neutral-700/10 hover:rounded-lg">
            <IoIosArrowBack />
            <h1 className="mr-0">Back</h1>
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 w-full flex-auto gap-2 md:gap-4">
        {state.gameOpt === null ? (
          <>
            <div
              onClick={() => handleOptionClick(GameOpt.QUIZ)}
              className="md:border-[1pt] bg-white border-none shadow-md shadow-black/5 rounded-md flex items-center justify-center text-sm md:text-lg text-center cursor-pointer overflow-hidden relative"
            >
              <div className="w-full text-neutral-950/70 p-2 rounded-md font-black text-2xl sm:text-3xl md:text-4xl h-full flex items-center justify-center absolute inset-0 backdrop-blur-sm sm:backdrop-blur-sm sm:hover:backdrop-blur-[2px] transition-all duration-300 z-10">
                Quiz
              </div>
              <span className="absolute origin-top w-full h-full scale-[1] translate-y-0 sm:scale-[1.6] xs:-translate-y-16 sm:translate-y-10 md:-translate-y-0 lg:scale-[1] lg:translate-y-0">
                <Image
                  src="/quiz.svg"
                  alt="single player"
                  height={1000}
                  width={1000}
                  className="object-cover"
                />
              </span>
            </div>

            <div
              onClick={() => handleOptionClick(GameOpt.MAP)}
              className="md:border-[1pt] bg-white border-none shadow-md shadow-black/5 rounded-md flex items-center justify-center text-sm md:text-lg text-center cursor-pointer overflow-hidden relative"
            >
              <div className="w-full text-neutral-950/70 p-2 rounded-md font-black text-2xl sm:text-3xl md:text-4xl h-full flex items-center justify-center absolute inset-0 backdrop-blur-sm sm:hover:backdrop-blur-[2px] transition-all duration-300 z-10">
                World Map
              </div>
              <span className="absolute origin-top w-full h-full scale-[1] translate-y-0 sm:scale-[1.6] xs:-translate-y-16 sm:translate-y-10 md:-translate-y-0 lg:scale-[1] lg:translate-y-0">
                <Image
                  src="/image_map.svg"
                  alt="single player"
                  height={1000}
                  width={1000}
                  className="object-cover"
                />
              </span>
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => handleModeClick(GameMode.SINGLE)}
              className={`md:border-[1pt] bg-white border-none shadow-md shadow-black/5 rounded-md flex items-center justify-center text-sm md:text-lg text-center ${
                selectedMode === null || selectedMode === GameMode.SINGLE
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50"
              } overflow-hidden relative`}
            >
              <div className="w-full text-neutral-950/70 p-2 rounded-md font-black text-2xl sm:text-3xl md:text-4xl h-full flex items-center justify-center absolute inset-0 backdrop-blur-sm sm:hover:backdrop-blur-[2px] transition-all duration-300 z-10">
                {isGameStarting && state.gameMode === GameMode.SINGLE ? (
                  <Spinner />
                ) : (
                  "Single Player"
                )}
              </div>
              <span className="absolute origin-top w-full h-full scale-[1] translate-y-0 sm:scale-[1.6] xs:-translate-y-16 sm:translate-y-10 md:-translate-y-0 lg:scale-[1] lg:translate-y-0">
                <Image
                  src="/singleplayer.svg"
                  alt="single player"
                  height={1000}
                  width={1000}
                  className="object-cover"
                />
              </span>
            </div>

            <div
              onClick={() => handleModeClick(GameMode.MULTI)}
              className={`md:border-[1pt] bg-white border-none shadow-md shadow-black/5 rounded-md flex items-center justify-center text-sm md:text-lg text-center ${
                selectedMode === null || selectedMode === GameMode.MULTI
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50"
              } overflow-hidden relative`}
            >
              <div className="w-full text-neutral-950/70 p-2 rounded-md font-black text-2xl sm:text-3xl md:text-4xl h-full flex items-center justify-center absolute inset-0 backdrop-blur-sm sm:hover:backdrop-blur-[2px] transition-all duration-300 z-10">
                {isGameStarting && state.gameMode === GameMode.MULTI ? (
                  <Spinner />
                ) : (
                  "Multi Player"
                )}
              </div>
              <span className="absolute origin-top w-full h-full scale-[1] translate-y-0 sm:scale-[1.6] xs:-translate-y-16 sm:translate-y-10 md:-translate-y-0 lg:scale-[1] lg:translate-y-0">
                <Image
                  src="/multiplayer.svg"
                  alt="single player"
                  height={1000}
                  width={1000}
                  className="object-cover"
                />
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <>
      Starting
      <CgSpinner className="animate-spin" />
    </>
  );
}
