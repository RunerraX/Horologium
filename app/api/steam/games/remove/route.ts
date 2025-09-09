import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const { game } = await req.json();

    const steamRes = await fetch("http://localhost:4000/steam/games/remove", {
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
