import {createMultiplayerGame} from "@/actions/multiplayer";
import {auth} from "@/auth";
import {NextResponse} from "next/server";

// POST /api/multiplayer/create
// api route to create new game session
export async function POST() {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const user = session.user;
  if (!user) {
    return NextResponse.json({error: "User not found"}, {status: 404});
  }

  const hostId = user.id;
  const hostDisplayName = user.name;
  //   const {duration} = req.body;

  try {
    // Create a new multiplayer game session
    const multiplayerGameSession = await createMultiplayerGame(
      hostId as string,
      hostDisplayName as string
    );

    return NextResponse.json(
      {...multiplayerGameSession, success: true},
      {status: 200}
    );
  } catch (error) {
    console.error("Failed to create game:", error);
    return NextResponse.json({error: "Failed to create game"}, {status: 500});
  }
}

