// /src/app/api/game/getgames/route.ts

import {NextResponse} from "next/server";

export async function GET() {
  console.log("GET /src/app/api/game/getgames route");
  return NextResponse.json({message: "New game endpoint!"});
}
