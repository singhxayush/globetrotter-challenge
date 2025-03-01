// src/app/api/game/answer/route.ts - API route for submitting an answer
import {NextRequest, NextResponse} from "next/server";
import {submitAnswer} from "@/actions/game";
import {auth} from "@/auth";

export async function POST(req: NextRequest) {
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

  // Parse the request body
  const body = await req.json();
  const {selectedOption} = body;

  if (!selectedOption) {
    return NextResponse.json({error: "Missing selected option"}, {status: 400});
  }

  // Submit the answer
  const result = await submitAnswer(user.id as string, selectedOption);

  if (!result.session) {
    return NextResponse.json({error: "No active session found"}, {status: 404});
  }

  return NextResponse.json({
    success: true,
    correct: result.correct,
    correctAnswer: result.correctAnswer,
    score: result.session.score,
    totalAnswered: result.session.totalAnswered,
    totalCorrect: result.session.totalCorrect,
    hasNextQuestion: result.nextQuestion,
    gameCompleted: !result.nextQuestion,
  });
}
