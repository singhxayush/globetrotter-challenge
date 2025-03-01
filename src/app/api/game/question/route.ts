// src/app/api/game/question/route.ts - API route for getting current question
import {NextResponse} from "next/server";
import {getCurrentQuestion, getGameSession} from "@/actions/game";
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
  if (!gameSession || !gameSession.active) {
    return NextResponse.json(
      {
        error: "No active game session",
        message: "Please start a new game",
      },
      {status: 404}
    );
  }

  // Get the current question
  const {question, options, questionNumber, totalQuestions} =
    await getCurrentQuestion(user.id as string);

  if (!question || !options) {
    return NextResponse.json(
      {
        error: "No more questions available",
        gameCompleted: true,
        score: gameSession.score,
        totalCorrect: gameSession.totalCorrect,
        totalAnswered: gameSession.totalAnswered,
      },
      {status: 200}
    );
  }

  // Return question data without the answer
  return NextResponse.json({
    success: true,
    questionData: {
      id: question.id,
      clues: question.clues,
      funFacts: question.fun_facts,
      trivia: question.trivia,
      options: options,
    },
    progress: {
      current: questionNumber,
      total: totalQuestions,
    },
    gameStats: {
      score: gameSession.score,
      totalCorrect: gameSession.totalCorrect,
      totalAnswered: gameSession.totalAnswered,
    },
  });
}
