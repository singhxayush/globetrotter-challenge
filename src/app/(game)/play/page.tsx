// src/app/game/page.tsx
"use client";

import {useState, useEffect} from "react";
import axios from "axios";
import {redirect} from "next/navigation";
import ResultCard from "@/components/game/ResultCard";
import {
  bigScreenConfetti,
  smallScreenConfetti,
} from "@/components/game/Confetti";
import SubmitOrRestart from "@/components/game/SubmitOrRestart";
import LoadingState from "@/components/game/LoadingState";
import {OptionsPanel} from "@/components/game/OptionsPanel";
import {GameHeader} from "@/components/game/GameHeader";
import {CluesPanel} from "@/components/game/CluesPanel";
import {TimerBar} from "@/components/game/TimerBar";

// Types
export interface QuestionData {
  id: number;
  clues: string[];
  funFacts: string[];
  trivia: string[];
  options: string[];
}

export interface GameProgress {
  current: number;
  total: number;
}

export interface GameStats {
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
  // If there is, give a modal asking to continue or start new game
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
    window.location.href = "/menu";
  };

  // Render loading screen if no question loaded yet
  if (gameState.loading && !gameState.questionData) {
    return <LoadingState />;
  }

  return (
    <div className="flex items-center justify-center h-full w-full flex-col gap-4 bg-zinc-950">
      {!gameState.active && gameState.gameCompleted ? (
        // RESULT
        <ResultCard gameState={gameState} startGame={startGame} />
      ) : (
        // GAME ACTIVE - CLUE QUIZ
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
