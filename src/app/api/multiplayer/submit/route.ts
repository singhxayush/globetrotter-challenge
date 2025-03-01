// src/app/api/multiplayer/submit/route.ts

import {NextResponse} from "next/server";
import {submitMultiplayerAnswer} from "@/actions/multiplayer";
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
    const {gameId, selectedOption} = requestData;

    if (!gameId || !selectedOption) {
      return NextResponse.json(
        {
          error: "Game ID and selected option are required",
        },
        {status: 400}
      );
    }

    // Submit answer for multiplayer game
    const result = await submitMultiplayerAnswer(
      user.id,
      gameId,
      selectedOption
    );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error submitting answer for multiplayer game:", error);
    return NextResponse.json(
      {
        error: "Failed to submit answer",
      },
      {status: 500}
    );
  }
}
