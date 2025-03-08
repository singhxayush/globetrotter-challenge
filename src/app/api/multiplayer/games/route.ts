// src/app/api/multiplayer/games/route.ts

import {NextResponse} from "next/server";
import {getAvailableMultiplayerGames} from "@/actions/multiplayer";
import {auth} from "@/auth";

export async function GET() {
  // Verify user authentication
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    // Get available games that users can join
    const games = await getAvailableMultiplayerGames();

    return NextResponse.json({
      success: true,
      games,
    });
  } catch (error) {
    console.error("Error fetching available games:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch available games",
      },
      {status: 500}
    );
  }
}
