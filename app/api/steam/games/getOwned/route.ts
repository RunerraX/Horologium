import {NextResponse} from "next/server";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        })
    }

    const res = await fetch("http://localhost:4000/steam/games/getOwned", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await res.json()
    console.log(data)
    return NextResponse.json(data);
}
