// src/app/api/multiplayer/join/route.ts

import {NextResponse} from "next/server";
import {joinMultiplayerGame} from "@/actions/multiplayer";
import {auth} from "@/auth";

export async function POST(request: Request) {
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

  try {
    const requestData = await request.json();
    const gameId = requestData.gameId;

    if (!gameId) {
      return NextResponse.json(
        {
          error: "Game ID is required",
        },
        {status: 400}
      );
    }

    // Join the multiplayer game
    const result = await joinMultiplayerGame(user.id, gameId);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.message,
        },
        {status: 400}
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      game: result.game,
    });
  } catch (error) {
    console.error("Error joining multiplayer game:", error);
    return NextResponse.json(
      {
        error: "Failed to join multiplayer game",
      },
      {status: 500}
    );
  }
}
