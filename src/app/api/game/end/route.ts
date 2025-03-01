// src/app/api/game/end/route.ts

import {NextResponse} from "next/server";
import {endGameSession} from "@/actions/game";
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

  // End the game session
  await endGameSession(user.id);

  return NextResponse.json({
    success: true,
    message: "Game session ended successfully",
  });
}
