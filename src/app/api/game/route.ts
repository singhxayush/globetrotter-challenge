// src/app/api/game/route.ts - API route for game session
import {NextResponse} from "next/server";
import {createGameSession} from "@/actions/game";
import {auth} from "@/auth";

// Start a new game session
export async function POST() {
  // Verify user authentication
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  // Get the user from the session
  const user = session.user;

  if (!user) {
    return NextResponse.json({error: "User not found"}, {status: 404});
  }

  // Create a new game session
  const gameSession = await createGameSession(user.id as string);

  // Return success but don't expose all the session details
  return NextResponse.json({
    success: true,
    message: "Game session created successfully",
    totalQuestions: gameSession.questions.length,
  });
}
