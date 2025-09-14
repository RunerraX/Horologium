import { NextRequest, NextResponse } from "next/server";
import "dotenv/config"

export async function POST(req: NextRequest) {
  try {
    const { game } = await req.json();

    const steamRes = await fetch(`http://localhost:${process.env.STEAM_API_PORT}/steam/games/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ games: game}), // <-- fixed here
    });

    const data = await steamRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
  }

}
