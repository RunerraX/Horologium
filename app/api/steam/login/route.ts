import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, password, code } = await req.json();

    const steamRes = await fetch(`http://localhost:${process.env.STEAM_API_PORT}/steam/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, steamGuardCode: code }),
    });

    const data = await steamRes.json();
    if (data.error == "Steam Guard code required") {
        return NextResponse.json({ require2FA: true });
    } 

    if (!steamRes.ok) {
        return NextResponse.json({ error: data.error }, { status: steamRes.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Next.js API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
