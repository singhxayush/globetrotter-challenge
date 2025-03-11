import {polling} from "@/actions/multiplayer";
import {auth} from "@/auth";
import {NextRequest, NextResponse} from "next/server";

// GET /api/multiplayer/status?gameId=xyz
export async function GET(request: NextRequest) {
  // Extract gameId from URL parameters
  const {searchParams} = new URL(request.url);
  const gameId = searchParams.get("gameId");

  // Validate gameId
  if (!gameId) {
    return NextResponse.json({error: "Game ID is required"}, {status: 400});
  }

  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const user = session.user;
  if (!user) {
    return NextResponse.json({error: "User not found"}, {status: 404});
  }

  try {
    const getStatus = await polling(gameId);

    return NextResponse.json({...getStatus, success: true}, {status: 200});
  } catch (error) {
    console.error("Failed to get the game status while polling:", error);
    return NextResponse.json(
      {error: "Failed to get the game status", message: (error as Error).message},
      {status: 500}
    );
  }
}
