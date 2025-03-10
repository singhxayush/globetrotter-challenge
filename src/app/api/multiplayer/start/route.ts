import {startGame} from "@/actions/multiplayer";
import {auth} from "@/auth";
import {NextRequest, NextResponse} from "next/server";

// POST /api/multiplayer/start?gameId=xyz
export async function POST(request: NextRequest) {
  // Extract gameId from URL parameters
  const {searchParams} = new URL(request.url);
  const gameId = searchParams.get("gameId");

  console.log("\n------- POST /api/multiplayer/start -------\n");

  console.log(gameId);

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

  const userId = user.id;

  try {
    console.log("\n------- TRY CATCH -------\n");
    const start = await startGame(userId as string, gameId);

    return NextResponse.json({...start, success: true}, {status: 200});
  } catch (error) {
    console.error("Failed to start the game:", error);
    return NextResponse.json(
      {error: "Failed to start the game", message: (error as Error).message},
      {status: 500}
    );
  }
}
