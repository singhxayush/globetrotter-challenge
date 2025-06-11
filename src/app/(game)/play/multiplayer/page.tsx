// app/game/multiplayer/page.tsx - Main multiplayer landing page
"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";

export default function MultiplayerLobby() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const createRoom = async () => {
    // const response = await axios.post("/api/multiplayer/create");
    // console.log(response);
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/multiplayer/create");
      console.log(response.data)
      if (response.data.success) {
        // Navigate to the game room
        router.push(`/game/multiplayer/${response.data.gameId}`);
      } else {
        setError("Failed to create game room");
      }
    } catch (err) {
      setError("An error occurred while creating the game room");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-4 mt-[5.5rem]">
      <h1 className="text-3xl font-bold mb-8">Multiplayer Game</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={createRoom}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create New Game"}
        </button>
      </div>
    </div>
  );
}
