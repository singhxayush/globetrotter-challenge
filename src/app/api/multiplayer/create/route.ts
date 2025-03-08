// import {NextResponse} from "next/server";
// import {createMultiplayerGame} from "@/actions/multiplayer";
// import {auth} from "@/auth";

// export async function POST(request: Request) {
//   // Verify user authentication
//   const session = await auth();
//   if (!session || !session.user?.email) {
//     return NextResponse.json({error: "Unauthorized"}, {status: 401});
//   }

//   // Get the user from the session
//   const user = session.user;
//   if (!user || !user.id) {
//     return NextResponse.json({error: "User not found"}, {status: 404});
//   }

//   try {
//     // Default to 4 players
//     let maxPlayers = 4;

//     // Try to parse body if it exists
//     try {
//       const requestData = await request.json();
//       if (requestData.maxPlayers) {
//         maxPlayers = requestData.maxPlayers;
//       }
//     } catch {
//       // Ignore JSON parsing errors and use default maxPlayers
//     }

//     // Create a new multiplayer game
//     const game = await createMultiplayerGame(user.id, maxPlayers);

//     // Return sessionId for client
//     return NextResponse.json({
//       success: true,
//       message: "Multiplayer game created successfully",
//       sessionId: game.gameId,
//     });
//   } catch (error) {
//     console.error("Error creating multiplayer game:", error);
//     return NextResponse.json(
//       {error: "Failed to create multiplayer game"},
//       {status: 500}
//     );
//   }
// }
