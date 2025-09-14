import { NextRequest, NextResponse } from "next/server";
import "dotenv/config"


export async function POST(req: NextRequest) {


    const steamRes = await fetch(`http://localhost:${process.env.STEAM_API_PORT}/steam/games/start`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    return NextResponse.json( await steamRes.json())



}
