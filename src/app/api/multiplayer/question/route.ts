// src/app/api/multiplayer/question/route.ts

import {NextResponse} from "next/server";
import {getMultiplayerCurrentQuestion} from "@/actions/multiplayer";
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
    // Get current question for the user
    const questionData = await getMultiplayerCurrentQuestion(user.id, gameId);

    if (!questionData.question) {
      return NextResponse.json(
        {
          error: "Question not found",
        },
        {status: 404}
      );
    }

    return NextResponse.json({
      success: true,
      ...questionData,
    });
  } catch (error) {
    console.error("Error fetching multiplayer question:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch question",
      },
      {status: 500}
    );
  }
}
