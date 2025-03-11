// app/game/multiplayer/[gameId]/page.tsx - Game room page
"use client";

import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import axios, {AxiosError} from "axios";
import {GameStatus} from "@/types/multi_player";
import GameStatusPoller from "@/components/game/GameStatusPoller";

// Types
interface GameDetails {
  status: GameStatus;
  isHost: boolean;
  hostName: string;
  hostId: string;
  success?: boolean;
}

// interface PlayerInfo {
//   userId: string;
//   userDisplayName: string;
//   score?: number;
// }

export default function GameRoom() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;

  const [roomNotFound, setRoomNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  // const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const updateGameStatus = (status: GameStatus) => {
    setGameDetails((prev) => (prev ? {...prev, status} : null));
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
          setGameDetails(response.data);
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

  // const fetchPlayers = async () => {
  //   try {
  //     // This would be an API endpoint to fetch the leaderboard/players list
  //     // Placeholder for demonstration
  //     const response = await axios.get(
  //       `/api/multiplayer/players?gameId=${gameId}`
  //     );
  //     setPlayers(response.data.players);
  //   } catch (err) {
  //     console.error("Failed to fetch players:", err);
  //   }
  // };

  const startGame = async () => {
    // This would call an API to start the game
    try {
      const response = await axios.post(
        `/api/multiplayer/start?gameId=${gameId}`
      );

      if (response.data.success) {
        // Update game status or redirect to the actual game
        setGameDetails({
          ...gameDetails!,
          status: GameStatus.ACTIVE,
        });
      }
    } catch (err) {
      console.error("Failed to start game:", err);
    }
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/game/multiplayer/${gameId}`;
    navigator.clipboard.writeText(link);
    alert("Invite link copied to clipboard!");
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading game room...</div>;
  }

  if (roomNotFound) {
    return (
      <div className="w-full h-full">
        <h1 className="text-2xl items-center">Room not found</h1>
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        <p>The game room you are trying to join does not exist.</p>
        <button
          onClick={() => router.push("/game/multiplayer")}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Back to Lobby
        </button>
      </div>
    );
  }

  if (!gameDetails) {
    return <div className="container mx-auto p-4">Game not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <GameStatusPoller
        gameId={gameId}
        updateGameStatus={updateGameStatus}
        currentStatus={gameDetails?.status || GameStatus.WAITING}
      />
      <h1 className="text-3xl font-bold mb-4"></h1>

      <div className="mb-6">
        <div className="text-lg">
          {gameDetails.status === GameStatus.WAITING ? (
            gameDetails.isHost ? (
              <h1 className="font-bold text-red-500">
                Other Players Are waiting for you to start.
              </h1>
            ) : (
              <h1 className="font-bold text-red-500">
                Waiting For Host to start.
              </h1>
            )
          ) : gameDetails.status === GameStatus.ACTIVE ? (
            <h1 className="font-bold text-xl text-green-500">
              Game On! Let&apos;s Go!!!
            </h1>
          ) : (
            <h1>Game Already Finished</h1>
          )}
        </div>
        <p className="text-lg">
          Host: <span className="font-medium">{gameDetails.hostName}</span>
        </p>
        {gameDetails.isHost && (
          <p className="text-green-600 font-medium">You are the host</p>
        )}
      </div>

      {/* <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Players</h2>
        {players.length > 0 ? (
          <ul className="border rounded divide-y">
            {players.map((player) => (
              <li
                key={player.userId}
                className="p-3 flex justify-between items-center"
              >
                <span>{player.userDisplayName}</span>
                <span className="font-medium">Score: {player.score || 0}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Waiting for players to join...</p>
        )}
      </div> */}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={copyInviteLink}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Copy Invite Link
        </button>

        {gameDetails.isHost && gameDetails.status === "waiting" && (
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
    </div>
  );
}

// Start game functionality - Which only host can do + Changes the Status to "active" + Up untill this points users will poll to get the status of the game and get questions
