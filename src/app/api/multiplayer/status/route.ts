import {NextResponse} from "next/server";
import {getMultiplayerGame} from "@/actions/multiplayer";
import {auth} from "@/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const gameId = url.searchParams.get("gameId");

  if (!gameId) {
    return NextResponse.json({error: "Missing gameId"}, {status: 400});
  }

  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  try {
    const game = await getMultiplayerGame(gameId);
    if (!game) {
      return NextResponse.json({error: "Game not found"}, {status: 404});
    }

    return NextResponse.json({success: true, game});
  } catch (error) {
    console.error("Error fetching game status:", error);
    return NextResponse.json(
      {error: "Failed to fetch game status"},
      {status: 500}
    );
  }
}
