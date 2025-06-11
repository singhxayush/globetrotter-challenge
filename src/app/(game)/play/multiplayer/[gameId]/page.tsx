// app/game/multiplayer/[gameId]/page.tsx - Game room page
"use client";

import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import axios, {AxiosError} from "axios";
import {GameStatus} from "@/types/multi_player";
import GameStatusPoller from "@/components/game/GameStatusPoller";
import LoadingState from "@/components/game/LoadingState";
import RoomNotFound from "@/components/game/RoomNotFound";
import QuestionManager from "@/components/game/Temp";

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
  status: GameStatus;
  isHost: boolean;
  hostName: string;
  hostId: string;
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
  status: GameStatus.WAITING,
  isHost: false,
  hostName: "",
  hostId: "",
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

export default function GameRoom() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;

  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [roomNotFound, setRoomNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const updateGameStatus = (status: GameStatus) => {
    setGameState((prev) => ({...prev, status}));
  };

  useEffect(() => {
    // Join the game room
    const joinGame = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `/api/multiplayer/join?gameId=${gameId}`
        );

        if (response.data.success) {
          // setGameState(response.data);
          setGameState((prev) => ({...prev, ...response.data}));
        } else {
          setError("Failed to join the game");
        }
      } catch (err: unknown) {
        const error = err as AxiosError<{message?: string}>;
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred while joining the game";

        setError(errorMessage);

        if (error.response?.status === 500) {
          setRoomNotFound(true);
        }

        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (gameId) {
      joinGame();
    }
  }, [gameId]);

  useEffect(() => {})

  const startGame = async () => {
    // This would call an API to start the game
    try {
      const response = await axios.post(
        `/api/multiplayer/start?gameId=${gameId}`
      );

      if (response.data.success) {
        // Update game status or redirect to the actual game
        setGameState({
          ...gameState!,
          status: GameStatus.ACTIVE,
        });
      }
    } catch (err) {
      console.error("Failed to start game:", err);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (roomNotFound) {
    return <RoomNotFound error={error} />;
  }

  return (
    <div className="container mx-auto p-4">
      {!gameState?.isHost && (
        <GameStatusPoller
          gameId={gameId}
          updateGameStatus={updateGameStatus}
          currentStatus={gameState?.status || GameStatus.WAITING}
        />
      )}

      <h1 className="text-3xl font-bold mb-4"></h1>

      <div className="mb-6">
        <div className="text-lg">
          {gameState?.status === GameStatus.WAITING ? (
            gameState?.isHost ? (
              <h1 className="font-bold text-red-500">
                Other Players Are waiting for you to start.
              </h1>
            ) : (
              <h1 className="font-bold text-red-500">
                Waiting For Host to start.
              </h1>
            )
          ) : gameState?.status === GameStatus.ACTIVE ? (
            <h1 className="font-bold text-xl text-green-500">
              Game On! Let&apos;s Go!!!
            </h1>
          ) : (
            <h1>Game Already Finished</h1>
          )}
        </div>
        <p className="text-lg">
          Host: <span className="font-medium">{gameState?.hostName}</span>
        </p>
        {gameState?.isHost && (
          <p className="text-green-600 font-medium">You are the host</p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {gameState?.isHost && gameState?.status === "waiting" && (
          <button
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            Start Game
          </button>
        )}

        <button
          onClick={() => router.push("/game/multiplayer")}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          Back to Lobby
        </button>
      </div>

      <QuestionManager gameId={gameId} />
    </div>
  );
}
