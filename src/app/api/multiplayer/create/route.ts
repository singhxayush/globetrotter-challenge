export const VAL = 10000;

// import {createMultiplayerGame} from "@/actions/multiplayer";

// import {auth} from "@/auth";
// import {NextResponse} from "next/server";

// export async function POST() {
//   const session = await auth();
//   if (!session || !session.user?.email) {
//     return NextResponse.json({error: "Unauthorized"}, {status: 401});
//   }

//   const user = session.user;
//   if (!user) {
//     return NextResponse.json({error: "User not found"}, {status: 404});
//   }

//   // Create a new game session
//   const multiplayerGameSession = await createMultiplayerGame(
//     user.id as string,
//     user.name as string,
//     900
//   );

// }
