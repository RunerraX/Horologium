import {NextResponse} from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import "dotenv/config"

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        })
    }

    const res = await fetch(`http://localhost:${process.env.STEAM_API_PORT}/steam/games/getOwned`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await res.json()
    console.log(data)
    return NextResponse.json(data);
}
