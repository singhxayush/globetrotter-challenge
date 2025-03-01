// src/app/api/game/delete/route.ts

import {NextResponse} from "next/server";
import {deleteGameSession} from "@/actions/game";
import {auth} from "@/auth";

export async function DELETE() {
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

  // Delete the game session
  await deleteGameSession(user.id);

  return NextResponse.json({
    success: true,
    message: "Game session deleted successfully",
  });
}
