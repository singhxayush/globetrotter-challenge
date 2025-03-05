// src/app/game/page.tsx
"use client";

import {useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";
import axios from "axios";
import {redirect} from "next/navigation";
import {ImSpinner5} from "react-icons/im";
import GameMenu from "@/components/game/GameMenu";
import ResultCard from "@/components/game/ResultCard";
import {
  bigScreenConfetti,
  smallScreenConfetti,
} from "@/components/game/Confetti";
import {
  BrainCircuit,
  Flame,
  Hourglass,
  ListOrdered,
  PartyPopper,
  Search,
  X,
} from "lucide-react";
import {cn} from "@/lib/utils";
import SubmitOrRestart from "@/components/game/SubmitOrRestart";

// Types
interface QuestionData {
  id: number;
  clues: string[];
  funFacts: string[];
  trivia: string[];
  options: string[];
}

interface GameProgress {
  current: number;
  total: number;
}

interface GameStats {
  score: number;
  totalCorrect: number;
  totalAnswered: number;
}

export interface GameState {
  active: boolean;
  questionData: QuestionData | null;
  selectedOption: string | null;
  feedback: {
    message: string;
    isCorrect: boolean | null;
    correctAnswer: string | null;
  };
  progress: GameProgress | null;
  stats: GameStats | null;
  loading: boolean;
  gameCompleted: boolean;
  revealedClues: number;
  showFunFacts: boolean;
  timeRemaining: number;
}

// Constants
const INITIAL_GAME_STATE: GameState = {
  active: false,
  questionData: null,
  selectedOption: null,
  feedback: {
    message: "",
    isCorrect: null,
    correctAnswer: null,
  },
  progress: null,
  stats: null,
  loading: false,
  gameCompleted: false,
  revealedClues: 1,
  showFunFacts: false,
  timeRemaining: 900,
};

const CLUE_REVEAL_INTERVAL = 8000;

// Main Game Component
export default function Game() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Format time as mm:ss
  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Check if there's an active game
  const checkGameStatus = async () => {
    setGameState((prev) => ({...prev, loading: true}));
    try {
      const response = await axios.get("/api/game/status");
      const data = response.data;
      if (data.active) {
        setGameState((prev) => ({
          ...prev,
          active: true,
          progress: data.progress,
          stats: data.stats,
          streakCount: data.streakCount || 0,
          timeRemaining: data.timeRemaining || prev.timeRemaining,
          loading: false,
        }));
        fetchCurrentQuestion();
        setTimerActive(true);
      } else {
        setGameState((prev) => ({...prev, loading: false}));
      }
    } catch (error) {
      console.error("Error checking game status:", error);
      setGameState((prev) => ({...prev, loading: false}));
    }
  };

  // Check if there's an active game on mount
  useEffect(() => {
    checkGameStatus();
  }, []);

  // Overall game timer
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (timerActive && gameState.timeRemaining > 0) {
      timerId = setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }));
      }, 1000);
    } else if (gameState.timeRemaining === 0 && gameState.active) {
      endGame();
    }
    return () => clearTimeout(timerId);
  }, [timerActive, gameState.timeRemaining, gameState.active]);

  // Gradually reveal clues
  useEffect(() => {
    let clueTimer: NodeJS.Timeout;
    if (
      gameState.active &&
      gameState.questionData &&
      gameState.revealedClues < gameState.questionData.clues.length &&
      !gameState.feedback.message
    ) {
      clueTimer = setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          revealedClues: Math.min(
            prev.revealedClues + 1,
            prev.questionData?.clues.length || 1
          ),
        }));
      }, CLUE_REVEAL_INTERVAL);
    }
    return () => clearTimeout(clueTimer);
  }, [
    gameState.active,
    gameState.questionData,
    gameState.revealedClues,
    gameState.feedback.message,
  ]);

  // End the game and clean up session
  const endGame = async () => {
    setTimerActive(false);
    try {
      await axios.delete("/api/game/session");
      setGameState((prev) => ({
        ...prev,
        active: false,
        gameCompleted: true,
      }));
      redirect("/game");
    } catch (error) {
      console.error("Error ending game:", error);
    }
  };

  // Start a new game
  const startGame = async () => {
    setGameState((prev) => ({...prev, loading: true}));
    try {
      await axios.post("/api/game");
      await fetchCurrentQuestion();
      setGameState((prev) => ({
        ...prev,
        active: true,
        loading: false,
        gameCompleted: false,
        revealedClues: 1,
        timeRemaining: 900,
        streakCount: 0,
        showFunFacts: false,
        feedback: {
          message: "",
          isCorrect: null,
          correctAnswer: null,
        },
      }));
      setTimerActive(true);
    } catch (error) {
      console.error("Error starting game:", error);
      setGameState((prev) => ({
        ...prev,
        loading: false,
        feedback: {
          message: "Error starting game. Please try again.",
          isCorrect: null,
          correctAnswer: null,
        },
      }));
    }
  };

  // Fetch the current question
  const fetchCurrentQuestion = async () => {
    setGameState((prev) => ({
      ...prev,
      loading: true,
      showFunFacts: false,
      selectedOption: null,
      feedback: {message: "", isCorrect: null, correctAnswer: null},
    }));
    try {
      const response = await axios.get("/api/game/question");
      const data = response.data;
      if (data.error) {
        if (data.gameCompleted) {
          setGameState((prev) => ({
            ...prev,
            loading: false,
            gameCompleted: true,
            active: false,
            stats: {
              score: data.score,
              totalCorrect: data.totalCorrect,
              totalAnswered: data.totalAnswered,
            },
          }));
          setTimerActive(false);
          await endGame();
          return;
        }
        throw new Error(data.error);
      }
      setGameState((prev) => ({
        ...prev,
        questionData: data.questionData,
        progress: data.progress,
        stats: data.gameStats,
        selectedOption: null,
        loading: false,
        revealedClues: 1,
        showFunFacts: false,
        feedback: {message: "", isCorrect: null, correctAnswer: null},
      }));
    } catch (error) {
      console.error("Error fetching question:", error);
      setGameState((prev) => ({
        ...prev,
        loading: false,
        feedback: {
          message: "Error fetching question. Please try again.",
          isCorrect: null,
          correctAnswer: null,
        },
      }));
    }
  };

  // Skip the current question
  const skipQuestion = async () => {
    setGameState((prev) => ({...prev, loading: true}));
    if (
      gameState.progress &&
      gameState.progress.current >= gameState.progress.total
    ) {
      await endGame();
      return;
    }
    try {
      await axios.post("/api/game/skip");
      fetchCurrentQuestion();
    } catch (error) {
      console.error("Error skipping question:", error);
      setGameState((prev) => ({
        ...prev,
        loading: false,
        feedback: {
          message: "Error skipping question. Please try again.",
          isCorrect: null,
          correctAnswer: null,
        },
      }));
    }
  };

  // Submit answer for the current question
  const handleSubmitAnswer = async () => {
    if (!gameState.selectedOption) return;
    setGameState((prev) => ({...prev, loading: true}));
    try {
      const response = await axios.post("/api/game/answer", {
        selectedOption: gameState.selectedOption,
      });
      const data = response.data;
      setGameState((prev) => ({
        ...prev,
        loading: false,
        showFunFacts: true,
        feedback: {
          message: data.correct
            ? "Correct! Well done!"
            : `Incorrect. The correct answer is: ${data.correctAnswer}`,
          isCorrect: data.correct,
          correctAnswer: data.correctAnswer,
        },
        stats: {
          score: data.score,
          totalCorrect: data.totalCorrect,
          totalAnswered: data.totalAnswered,
        },
        streakCount: data.streakCount || 0,
        gameCompleted: data.gameCompleted,
      }));
      if (data.correct) {
        if (window.innerWidth > 768) {
          bigScreenConfetti();
        } else {
          smallScreenConfetti();
        }
      }
      if (data.gameCompleted) {
        await endGame();
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setGameState((prev) => ({
        ...prev,
        loading: false,
        feedback: {
          message: "Error submitting answer. Please try again.",
          isCorrect: null,
          correctAnswer: null,
        },
      }));
    }
  };

  const handleEndGame = async () => {
    await endGame();
    // Full page refresh
    window.location.href = "/game";
  };

  // Create a new function to handle multiplayer game creation
  // const startMultiplayerGame = async () => {
  //   setGameState((prev) => ({...prev, loading: true}));
  //   try {
  //     // Call the API to create a new multiplayer session
  //     const response = await axios.post("/api/multiplayer/create");
  //     const {sessionId} = response.data;

  //     // Redirect to the waiting room with the session ID
  //     router.push(`/game/multiplayer/${sessionId}`);
  //   } catch (error) {
  //     console.error("Error creating multiplayer game:", error);
  //     setGameState((prev) => ({
  //       ...prev,
  //       loading: false,
  //       feedback: {
  //         message: "Error creating multiplayer game. Please try again.",
  //         isCorrect: null,
  //         correctAnswer: null,
  //       },
  //     }));
  //   }
  // };

  // Render loading screen if no question loaded yet
  if (gameState.loading && !gameState.questionData) {
    return (
      <div className="flex justify-center items-center h-full w-full gap-2 animate-pulse">
        <span className="text-white text-xl">Loading</span>
        <ImSpinner5 className="animate-spin text-white w-5 h-5 duration-1000" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full w-full flex-col gap-4 bg-zinc-950">
      {!gameState.active ? (
        // When Game is not running - Completed state: Game Menu | Result {todo} change the order
        <div className="text-center w-5/4 md:mx-2 bg-white/90 rounded-sm shadow-lg md:p-4 transition-all h-full w-full flex items-center justify-center flex-col">
          {!gameState.gameCompleted ? (
            // GAME MENU
            <GameMenu startGame={startGame} gameState={gameState} />
          ) : (
            // RESULT
            <ResultCard gameState={gameState} startGame={startGame} />
          )}
        </div>
      ) : (
        // GAME ACTIVE - CLUE QUIZ | IMAGE GEO GUESS - BOTH SINGLE + MULTIPLAYER
        <div className="transition-all w-full h-full flex flex-col">
          <div className="w-full h-auto md:h-full bg-white md:rounded-md rounded-none">
            <div className="w-full h-full flex md:flex-col flex-col">
              <GameHeader
                progress={gameState.progress}
                stats={gameState.stats}
                timeRemaining={gameState.timeRemaining}
                formatTime={formatTimeRemaining}
                startGame={startGame}
                handleEndGame={handleEndGame}
              />

              <TimerBar
                timeRemaining={gameState.timeRemaining}
                totalTime={900}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
                <CluesPanel
                  questionData={gameState.questionData}
                  revealedClues={gameState.revealedClues}
                  showFunFacts={gameState.showFunFacts}
                />

                <OptionsPanel
                  questionData={gameState.questionData}
                  selectedOption={gameState.selectedOption}
                  setSelectedOption={(option) =>
                    setGameState((prev) => ({
                      ...prev,
                      selectedOption: option,
                    }))
                  }
                  feedback={gameState.feedback}
                  loading={gameState.loading}
                  handleSubmitAnswer={handleSubmitAnswer}
                  skipQuestion={skipQuestion}
                />

                <div className="block md:hidden">
                  <SubmitOrRestart
                    startGame={startGame}
                    handleEndGame={handleEndGame}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// TimerBar Component
function TimerBar({
  timeRemaining,
  totalTime,
}: {
  timeRemaining: number;
  totalTime: number;
}) {
  const percentage = (timeRemaining / totalTime) * 100;
  const progressColor =
    percentage > 60
      ? "bg-green-600"
      : percentage > 30
      ? "bg-yellow-400"
      : "bg-red-600";

  return (
    <div className="w-full bg-gray-200 h-2">
      <div
        className={`h-2 ${progressColor}`}
        style={{width: `${percentage}%`, transition: "width 1s linear"}}
      ></div>
    </div>
  );
}

type GameHeaderProps = {
  progress: GameProgress | null;
  stats: GameStats | null;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
  startGame: () => Promise<void>;
  handleEndGame: () => Promise<void>;
};

// Header Component
function GameHeader({
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

// CluesPanel Component
function CluesPanel({
  questionData,
  revealedClues,
  showFunFacts,
}: {
  questionData: QuestionData | null;
  revealedClues: number;
  showFunFacts: boolean;
}) {
  return (
    <div className="p-6 border-r border-gray-200 min-h-[20dvh]">
      {!showFunFacts && (
        <>
          <div className="flex gap-2 items-center mb-4">
            <BrainCircuit />
            <h2 className="text-xl font-semibold">Clues:</h2>
          </div>
          <ul className="space-y-3 mb-6">
            {questionData?.clues.slice(0, revealedClues).map((clue, index) => (
              <motion.li
                key={index}
                initial={{opacity: 0, x: -10}}
                animate={{opacity: 1, x: 0}}
                transition={{delay: index * 0.2}}
                className="flex items-start p-3 bg-blue-50 rounded-md"
              >
                <span className="text-blue-500 mr-2">
                  <Search />
                </span>
                <span className="text-gray-700">{clue}</span>
              </motion.li>
            ))}
            {questionData && revealedClues < questionData.clues.length && (
              <li className="text-sm text-gray-500 italic p-2">
                More clues will be revealed soon...
              </li>
            )}
          </ul>
        </>
      )}

      {/* Fun Facts */}
      <AnimatePresence>
        {showFunFacts && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: "auto"}}
            exit={{opacity: 0, height: 0}}
            transition={{duration: 0.3}}
          >
            <div className="flex gap-2">
              <Flame />
              <h3 className="text-lg font-semibold  mb-2">Fun Facts:</h3>
            </div>
            <div className="space-y-3">
              {questionData?.funFacts.map((fact, index) => (
                <div
                  key={index}
                  className="p-3 bg-purple-50 rounded-md text-gray-700 border-l-4 border-purple-300"
                >
                  {fact}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// OptionsPanel Component
function OptionsPanel({
  questionData,
  selectedOption,
  setSelectedOption,
  feedback,
  loading,
  handleSubmitAnswer,
  skipQuestion,
}: {
  questionData: QuestionData | null;
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
  feedback: {
    message: string;
    isCorrect: boolean | null;
    correctAnswer: string | null;
  };
  loading: boolean;
  handleSubmitAnswer: () => void;
  skipQuestion: () => void;
}) {
  return (
    <div className="p-6">
      <div className="flex gap-2 items-center mb-4">
        <ListOrdered />
        <h3 className="text-lg font-semibold">Select the correct city:</h3>
      </div>
      <div className="grid grid-cols-1 gap-2 mb-4">
        {questionData?.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(option)}
            className={`md:p-4 p-2 text-left rounded-lg border-2 transition-all ${
              selectedOption === option
                ? "bg-sky-100 border-sky-500 shadow-md"
                : "bg-neutral-100 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            } ${
              feedback.isCorrect !== null && feedback.correctAnswer === option
                ? "bg-green-100 border-green-500"
                : ""
            }`}
            disabled={loading || feedback.isCorrect !== null}
          >
            {String.fromCharCode(65 + index) + ". "}
            {option}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {feedback.message && (
          <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            className={`mb-4 p-2 rounded-md ${
              feedback.isCorrect
                ? "bg-green-50 text-green-800 border border-green-200"
                : feedback.isCorrect === false
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
            }`}
          >
            <div className="flex items-center">
              {feedback.isCorrect ? (
                <span className="mr-2">
                  <PartyPopper />
                </span>
              ) : feedback.isCorrect === false ? (
                <span className="mr-2">
                  <X className="text-red-500 stroke-[4px]" />
                </span>
              ) : (
                <span className="mr-2">ℹ️</span>
              )}
              <span>{feedback.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex space-x-3">
        <button
          onClick={handleSubmitAnswer}
          disabled={loading || !selectedOption || feedback.isCorrect !== null}
          className={`flex-1 rounded-lg font-medium transition-colors duration-200 py-4 ${
            !selectedOption || loading || feedback.isCorrect !== null
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Submit Answer
        </button>
        {feedback.isCorrect !== null ? (
          <button
            onClick={skipQuestion} // In this state, "Next Question" triggers the same function.
            disabled={loading}
            className="flex-1 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={skipQuestion}
            disabled={loading}
            className="flex-1 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
          >
            Skip Question
          </button>
        )}
      </div>
    </div>
  );
}
