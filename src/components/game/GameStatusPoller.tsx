import {useEffect, useRef} from "react";
import axios from "axios";
import {GameStatus} from "@/types/multi_player";

type GameStatusPollerProps = {
  gameId: string;
  updateGameStatus: (status: GameStatus) => void;
  currentStatus: GameStatus; // Add current status to decide when to stop polling
};

const GameStatusPoller = ({
  gameId,
  updateGameStatus,
  currentStatus,
}: GameStatusPollerProps) => {
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentStatus === GameStatus.ACTIVE) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current); // Stop polling if game is active
      }
      return; // Exit early
    }

    const fetchGameStatus = async () => {
      try {
        const response = await axios.get(
          `/api/multiplayer/status?gameId=${gameId}`
        );
        const newStatus = response.data.status as GameStatus;

        if (newStatus !== currentStatus) {
          updateGameStatus(newStatus);
        }

        if (newStatus === GameStatus.ACTIVE && pollingRef.current) {
          clearInterval(pollingRef.current); // Stop polling once the game starts
        }
      } catch (err) {
        console.error("Error fetching game status:", err);
      }
    };

    pollingRef.current = setInterval(fetchGameStatus, 10000); // Poll every 10 seconds

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current); // Clean up interval on unmount
      }
    };
  }, [gameId, currentStatus, updateGameStatus]);

  return null; // No UI needed
};

export default GameStatusPoller;
