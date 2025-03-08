// src/app/api/multiplayer/rank/route.ts

import {NextResponse} from "next/server";
import {getUserRank} from "@/actions/multiplayer";
import {auth} from "@/auth";

export async function GET(request: Request) {
  // Verify user authentication
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  // Get the user from the session
  const user = session.user;
  if (!user || !user.id) {
    return NextResponse.json({error: "User not found"}, {status: 404});
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
    // Get user's rank in the game
    const rankInfo = await getUserRank(gameId, user.id);

    if (!rankInfo) {
      return NextResponse.json(
        {
          error: "Rank information not found",
        },
        {status: 404}
      );
    }

    return NextResponse.json({
      success: true,
      rank: rankInfo.rank,
      totalPlayers: rankInfo.totalPlayers,
    });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch user rank",
      },
      {status: 500}
    );
  }
}
