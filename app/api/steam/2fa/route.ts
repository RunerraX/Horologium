import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, code } = await req.json();

    const steamRes = await fetch("http://localhost:4000/steam/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, code }), // <-- fixed here
    });

    const data = await steamRes.json();

    if (!steamRes.ok) {
      return NextResponse.json({ error: data.error }, { status: steamRes.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Next.js API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
