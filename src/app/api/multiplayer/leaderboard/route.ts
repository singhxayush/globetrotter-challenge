// src/app/api/multiplayer/leaderboard/route.ts

import {NextResponse} from "next/server";
import {getMultiplayerLeaderboard} from "@/actions/multiplayer";
import {auth} from "@/auth";

export async function GET(request: Request) {
  // Verify user authentication
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  // Get URL parameters
  const {searchParams} = new URL(request.url);
  const gameId = searchParams.get("gameId");

  if (!gameId) {
    return NextResponse.json(
      {
        error: "Game ID is required",
      },
      {status: 400}
    );
  }

  try {
    // Get leaderboard for the game
    const leaderboard = await getMultiplayerLeaderboard(gameId);

    return NextResponse.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch leaderboard",
      },
      {status: 500}
    );
  }
}
