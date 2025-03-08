// src/app/api/game/status/route.ts - API route for getting current game status
import {NextResponse} from "next/server";
import {getGameSession} from "@/actions/game";
import {auth} from "@/auth";

export async function GET() {
  // Verify user authentication
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  // Get the user from database
  const user = session.user;

  if (!user) {
    return NextResponse.json({error: "User not found"}, {status: 404});
  }

  // Get the game session
  const gameSession = await getGameSession(user.id as string);

  if (!gameSession) {
    return NextResponse.json({
      active: false,
      message: "No game session found",
    });
  }

  return NextResponse.json({
    active: gameSession.active,
    progress: {
      current: gameSession.currentQuestionIndex + 1,
      total: gameSession.questions.length,
    },
    stats: {
      score: gameSession.score,
      totalCorrect: gameSession.totalCorrect,
      totalAnswered: gameSession.totalAnswered,
      remainingQuestions:
        gameSession.questions.length - gameSession.totalAnswered,
    },
    startTime: gameSession.startTime,
  });
}
