// src/app/game/multiplayer/[gameId]/page.tsx
"use client";

import {useState, useEffect, useCallback} from "react";
import confetti from "canvas-confetti";
import {motion, AnimatePresence} from "framer-motion";
import axios from "axios";
import {useRouter, useParams} from "next/navigation";
import Link from "next/link";

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

interface PlayerStats {
  userId: string;
  username: string;
  score: number;
  totalCorrect: number;
  totalAnswered: number;
  streakCount: number;
}

interface GameState {
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
  streakCount: number;
  showFunFacts: boolean;
  timeRemaining: number;
  leaderboard: PlayerStats[];
  waitingForPlayers: boolean;
  gameId: string | null;
  gameStarted: boolean;
  error: string | null;
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
  streakCount: 0,
  showFunFacts: false,
  timeRemaining: 1800,
  leaderboard: [],
  waitingForPlayers: true,
  gameId: null,
  gameStarted: false,
  error: null,
};

const CLUE_REVEAL_INTERVAL = 8000;
const LEADERBOARD_REFRESH_INTERVAL = 5000;
const WAITING_ROOM_REFRESH_INTERVAL = 3000;

// Main Multiplayer Game Component
export default function MultiplayerGame() {
  const router = useRouter();
  const params = useParams();
  const gameId = params.gameId as string;
  const [gameState, setGameState] = useState<GameState>({
    ...INITIAL_GAME_STATE,
    gameId,
  });
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Format time as mm:ss
  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Check game status
  const checkGameStatus = useCallback(async () => {
    if (!gameId) return;

    setGameState((prev) => ({...prev, loading: true}));
    try {
      // This would be a new API endpoint to check multiplayer game status
      const response = await axios.get(
        `/api/multiplayer/status?gameId=${gameId}`
      );
      const data = response.data;

      if (data.success) {
        const gameIsActive =
          data.game.status === "active" || data.game.status === "in_progress";
        const gameIsWaiting = data.game.status === "waiting";
        const gameIsCompleted = data.game.status === "completed";

        setGameState((prev) => ({
          ...prev,
          active: gameIsActive,
          waitingForPlayers: gameIsWaiting,
          gameCompleted: gameIsCompleted,
          gameStarted: gameIsActive || gameIsCompleted,
          progress: data.game.progress || prev.progress,
          stats: data.game.playerStats || prev.stats,
          streakCount: data.game.streakCount || 0,
          timeRemaining: data.game.timeRemaining || prev.timeRemaining,
          loading: false,
          error: null,
        }));

        if (gameIsActive) {
          fetchCurrentQuestion();
          setTimerActive(true);
          fetchLeaderboard();
        }
      } else {
        setGameState((prev) => ({
          ...prev,
          loading: false,
          error: data.message || "Failed to get game status",
        }));
      }
    } catch (error) {
      console.error("Error checking game status:", error);
      setGameState((prev) => ({
        ...prev,
        loading: false,
        error: "Error connecting to the game server",
      }));
    }
  }, [gameId]);

  // Check if there's an active game on mount
  useEffect(() => {
    if (gameId) {
      joinGame();
    }
  }, [gameId]);

  // Join existing game
  const joinGame = async () => {
    if (!gameId) return;

    setGameState((prev) => ({...prev, loading: true}));
    try {
      const response = await axios.post("/api/multiplayer/join", {gameId});
      if (response.data.success) {
        setGameState((prev) => ({
          ...prev,
          gameId,
          waitingForPlayers: response.data.game.status === "waiting",
          active:
            response.data.game.status === "active" ||
            response.data.game.status === "in_progress",
          gameStarted:
            response.data.game.status === "active" ||
            response.data.game.status === "in_progress",
          loading: false,
          error: null,
        }));

        // Check game status and start polling
        checkGameStatus();
      } else {
        setGameState((prev) => ({
          ...prev,
          loading: false,
          error: response.data.message || "Failed to join game",
        }));
      }
    } catch (error) {
      console.error("Error joining game:", error);
      setGameState((prev) => ({
        ...prev,
        loading: false,
        error: "Error connecting to the game server",
      }));
    }
  };

  // Poll for game status while waiting for players
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (gameState.waitingForPlayers && !gameState.gameStarted) {
      intervalId = setInterval(() => {
        checkGameStatus();
      }, WAITING_ROOM_REFRESH_INTERVAL);
    }

    return () => clearInterval(intervalId);
  }, [gameState.waitingForPlayers, gameState.gameStarted, checkGameStatus]);

  // Poll for leaderboard updates
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (gameState.active && gameState.gameId) {
      intervalId = setInterval(() => {
        fetchLeaderboard();
      }, LEADERBOARD_REFRESH_INTERVAL);
    }

    return () => clearInterval(intervalId);
  }, [gameState.active, gameState.gameId]);

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

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    if (!gameState.gameId) return;

    try {
      const response = await axios.get(
        `/api/multiplayer/leaderboard?gameId=${gameState.gameId}`
      );
      if (response.data.success) {
        setGameState((prev) => ({
          ...prev,
          leaderboard: response.data.leaderboard,
        }));
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  // End the game and redirect
  const endGame = async () => {
    setTimerActive(false);
    setGameState((prev) => ({
      ...prev,
      active: false,
      gameCompleted: true,
    }));
    router.push("/game");
  };

  // Fetch the current question
  const fetchCurrentQuestion = async () => {
    if (!gameState.gameId) return;

    setGameState((prev) => ({
      ...prev,
      loading: true,
      showFunFacts: false,
      selectedOption: null,
      feedback: {message: "", isCorrect: null, correctAnswer: null},
    }));

    try {
      const response = await axios.get(
        `/api/multiplayer/question?gameId=${gameState.gameId}`
      );
      const data = response.data;

      if (data.success) {
        setGameState((prev) => ({
          ...prev,
          questionData: data.questionData,
          progress: data.progress,
          stats: data.playerStats,
          streakCount: data.streakCount || prev.streakCount || 0,
          selectedOption: null,
          loading: false,
          revealedClues: 1,
          showFunFacts: false,
          feedback: {message: "", isCorrect: null, correctAnswer: null},
          error: null,
        }));
      } else {
        if (data.gameCompleted) {
          setGameState((prev) => ({
            ...prev,
            loading: false,
            gameCompleted: true,
            active: false,
            stats: data.playerStats,
          }));
          setTimerActive(false);
          return;
        }
        throw new Error(data.message || "Failed to fetch question");
      }
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
    if (!gameState.gameId) return;

    setGameState((prev) => ({...prev, loading: true}));

    if (
      gameState.progress &&
      gameState.progress.current >= gameState.progress.total
    ) {
      await endGame();
      return;
    }

    try {
      const response = await axios.post("/api/multiplayer/skip", {
        gameId: gameState.gameId,
      });
      if (response.data.success) {
        fetchCurrentQuestion();
      } else {
        throw new Error(response.data.message || "Failed to skip question");
      }
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
    if (!gameState.selectedOption || !gameState.gameId) return;

    setGameState((prev) => ({...prev, loading: true}));

    try {
      const response = await axios.post("/api/multiplayer/submit", {
        gameId: gameState.gameId,
        selectedOption: gameState.selectedOption,
      });

      const data = response.data;

      if (data.success) {
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
          stats: data.playerStats,
          streakCount: data.streakCount || 0,
          gameCompleted: data.gameCompleted,
        }));

        if (data.correct) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: {y: 0.8, x: 0.5},
          });
        }

        // Fetch updated leaderboard after submitting answer
        fetchLeaderboard();

        if (data.gameCompleted) {
          await endGame();
        }
      } else {
        throw new Error(data.message || "Failed to submit answer");
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


  // Render loading screen if no question loaded yet
  if (
    gameState.loading &&
    !gameState.questionData &&
    !gameState.waitingForPlayers
  ) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (gameState.error) {
    return (
      <div className="h-full w-full bg-zinc-950">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center bg-white rounded-lg shadow-lg p-8 transition-all mt-20">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">Error</h2>
            <p className="mb-6 text-gray-700">{gameState.error}</p>
            <Link
              href="/game"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Back to Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-zinc-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Waiting Room */}
        {gameState.waitingForPlayers && !gameState.gameStarted ? (
          <div className="text-center bg-white rounded-lg shadow-lg p-8 transition-all mt-20 md:mt-40">
            <h2 className="text-2xl font-semibold mb-4">Waiting for Players</h2>
            <p className="mb-6 text-gray-700">
              Share this game ID with your friends to invite them:
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center justify-center">
              <span className="font-mono text-xl select-all">
                {gameState.gameId}
              </span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(gameState.gameId || "")
                }
                className="ml-2 p-2 text-blue-600 hover:text-blue-800"
                title="Copy game ID"
              >
                📋
              </button>
            </div>
            <div className="animate-pulse mb-6">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto animate-spin"></div>
              <p className="text-blue-600 mt-2">Waiting for game to start...</p>
            </div>
            <div className="flex justify-center">
              <Link
                href="/game"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-md transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Leave Game
              </Link>
            </div>
          </div>
        ) : !gameState.gameCompleted ? (
          <div className="transition-all">
            <AnimatePresence mode="wait">
              <motion.div
                key={gameState.questionData?.id || "loading"}
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -10}}
                transition={{duration: 0.3}}
                className="bg-white rounded-lg shadow-lg mt-4"
              >
                {gameState.questionData ? (
                  // Game in progress
                  <div className="w-full h-full">
                    <div className="w-full h-full flex flex-col">
                      <GameHeader
                        progress={gameState.progress}
                        streakCount={gameState.streakCount}
                        stats={gameState.stats}
                        timeRemaining={gameState.timeRemaining}
                        formatTime={formatTimeRemaining}
                      />

                      <TimerBar
                        timeRemaining={gameState.timeRemaining}
                        totalTime={1800}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                        <div className="md:col-span-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
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
                          </div>
                        </div>

                        {/* Leaderboard Section */}
                        <LeaderboardPanel leaderboard={gameState.leaderboard} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
                      <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2.5"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2.5"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2.5"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          // Game completed state
          <div className="text-center bg-white rounded-lg shadow-lg p-8 transition-all mt-20">
            <h2 className="text-2xl font-bold mb-4">Game Completed!</h2>
            <div className="relative mb-8 mx-auto w-48 h-48">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-blue-600">
                  {gameState.stats
                    ? Math.round(gameState.stats.score * 100)
                    : 0}
                  %
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

            {/* Display Final Leaderboard */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Final Leaderboard</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                {gameState.leaderboard.length > 0 ? (
                  <ul className="space-y-2">
                    {gameState.leaderboard
                      .sort((a, b) => b.score - a.score)
                      .map((player, index) => (
                        <li
                          key={player.userId}
                          className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm"
                        >
                          <div className="flex items-center">
                            <span className="text-lg font-bold w-8 text-gray-500">
                              {index + 1}.
                            </span>
                            <span className="font-medium">
                              {player.username}
                              {index === 0 && " 🏆"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                              {Math.round(player.score * 100)}%
                            </span>
                            <span className="text-gray-500 text-sm">
                              {player.totalCorrect}/{player.totalAnswered}{" "}
                              correct
                            </span>
                          </div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500">
                    No player data available
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Link
                href="/game"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Back to Games
              </Link>
            </div>
          </div>
        )}
      </div>
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

// Header Component
function GameHeader({
  progress,
  streakCount,
  stats,
  timeRemaining,
  formatTime,
}: {
  progress: GameProgress | null;
  streakCount: number;
  stats: GameStats | null;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
}) {
  return (
    <div className="p-6 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500">
          Question {progress?.current} of {progress?.total}
        </span>
        {streakCount > 2 && (
          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
            🔥 {streakCount} streak
          </span>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
          Your Score: {stats ? Math.round(stats.score * 100) : 0}%
        </span>
        <span className="text-sm text-gray-500">
          Time: {formatTime(timeRemaining)}
        </span>
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
  questionData: QuestionData;
  revealedClues: number;
  showFunFacts: boolean;
}) {
  return (
    <div className="p-6 border-r border-gray-200 min-h-[20dvh]">
      {!showFunFacts && (
        <>
          <h2 className="text-xl font-semibold mb-4">Clues:</h2>
          <ul className="space-y-3 mb-6">
            {questionData.clues.slice(0, revealedClues).map((clue, index) => (
              <motion.li
                key={index}
                initial={{opacity: 0, x: -10}}
                animate={{opacity: 1, x: 0}}
                transition={{delay: index * 0.2}}
                className="flex items-start p-3 bg-blue-50 rounded-md"
              >
                <span className="text-blue-500 mr-2">🔍</span>
                <span className="text-gray-700">{clue}</span>
              </motion.li>
            ))}
            {revealedClues < questionData.clues.length && (
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
            <h3 className="text-lg font-semibold mt-6 mb-2">Fun Facts:</h3>
            <div className="space-y-3">
              {questionData.funFacts.map((fact, index) => (
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
  questionData: QuestionData;
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
      <h3 className="text-lg font-semibold mb-2">Select the correct city:</h3>
      <div className="grid grid-cols-1 gap-2 mb-4">
        {questionData.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(option)}
            className={`md:p-4 p-2 text-center rounded-lg border-2 transition-all ${
              selectedOption === option
                ? "bg-blue-100 border-blue-500 shadow-md"
                : "bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            } ${
              feedback.isCorrect !== null && feedback.correctAnswer === option
                ? "bg-green-100 border-green-500"
                : ""
            }`}
            disabled={loading || feedback.isCorrect !== null}
          >
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
                <span className="mr-2">🎉</span>
              ) : feedback.isCorrect === false ? (
                <span className="mr-2">❌</span>
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
          className={`flex-1 py-3 rounded-lg font-medium transition-colors duration-200 ${
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
            className="flex-1 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={skipQuestion}
            disabled={loading}
            className="flex-1 py-3 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
          >
            Skip Question
          </button>
        )}
      </div>
    </div>
  );
}

// LeaderboardPanel Component
function LeaderboardPanel({leaderboard}: {leaderboard: PlayerStats[]}) {
  return (
    <div className="p-6 border-t md:border-l border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Leaderboard</h3>
      <div className="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
        {leaderboard.length > 0 ? (
          <ul className="space-y-2">
            {leaderboard.map((player, index) => (
              <li
                key={player.userId}
                className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm"
              >
                <div className="flex items-center">
                  <span className="text-lg font-bold w-8 text-gray-500">
                    {index + 1}.
                  </span>
                  <span className="font-medium">
                    {player.username}
                    {index === 0 && " 🏆"}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {Math.round(player.score * 100)}%
                  </span>
                  <span className="text-gray-500 text-sm">
                    {player.totalCorrect}/{player.totalAnswered} correct
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            No players in the leaderboard yet.
          </p>
        )}
      </div>
    </div>
  );
}
