// src/app/api/game/skip/route.ts

import {NextResponse} from "next/server";
import {skipCurrentQuestion} from "@/actions/game";
import {auth} from "@/auth";

export async function POST() {
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

  // Skip the current question
  const result = await skipCurrentQuestion(user.id);

  if (!result.session) {
    return NextResponse.json({error: "Game session not found"}, {status: 404});
  }

  return NextResponse.json({
    success: true,
    nextQuestion: result.nextQuestion,
    totalAnswered: result.session.totalAnswered,
    totalCorrect: result.session.totalCorrect,
    currentQuestionIndex: result.session.currentQuestionIndex,
    totalQuestions: result.session.questions.length,
  });
}
