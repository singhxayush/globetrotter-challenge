"use client";

import React, {useState} from "react";
import axios from "axios";

interface GameQuestionResponse {
  success: boolean;
  // Add other response properties based on what verifyResponse_sendNextQuestion returns
  error?: string;
  message?: string;
}

const QuestionManager = ({gameId}: {gameId: string}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GameQuestionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameId) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await axios.get<GameQuestionResponse>(
        `/api/multiplayer/questions?gameId=${gameId}`,
        {}
      );

      setResponse(result.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Multiplayer Question Manager</h2>

      {gameId ? (
        <>
          <p className="mb-4 text-sm text-gray-600">Game ID: {gameId}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Question Number
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isLoading ? "Loading..." : "Send Question"}
            </button>
          </form>
        </>
      ) : (
        <p>Loading game ID...</p>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-bold">Response:</p>
          <pre className="whitespace-pre-wrap overflow-x-auto mt-2 text-sm">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default QuestionManager;
