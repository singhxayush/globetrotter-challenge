// src/app/api/multiplayer/skip/route.ts

import {NextResponse} from "next/server";
import {skipMultiplayerQuestion} from "@/actions/multiplayer";
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
    const {gameId} = requestData;

    if (!gameId) {
      return NextResponse.json(
        {
          error: "Game ID is required",
        },
        {status: 400}
      );
    }

    // Skip current question in multiplayer game
    const result = await skipMultiplayerQuestion(user.id, gameId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error skipping question in multiplayer game:", error);
    return NextResponse.json(
      {
        error: "Failed to skip question",
      },
      {status: 500}
    );
  }
}
