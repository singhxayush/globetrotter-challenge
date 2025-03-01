// src/app/api/game/session/route.ts
import {NextResponse} from "next/server";
import {deleteGameSession} from "@/actions/game";
import {auth} from "@/auth";

// Delete a game session
export async function DELETE() {
  console.log("#DELETE api/game/session/route.ts");
  // Verify user authentication
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  // Get the user ID from the session
  const userId = session.user.id as string;
  if (!userId) {
    return NextResponse.json({error: "User not found"}, {status: 404});
  }

  try {
    // Delete the game session
    await deleteGameSession(userId);

    // Return success
    return NextResponse.json({
      success: true,
      message: "Game session deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting game session:", error);
    return NextResponse.json(
      {error: "Failed to delete game session"},
      {status: 500}
    );
  }
}
