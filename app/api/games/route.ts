// /pages/api/games.ts (or app/api/games/route.ts if using App Router)

import prisma from "@/lib/prisma"; // adjust import path

export async function GET() {
  const games = await prisma.games.findMany();
  return Response.json({ games: games.map((g) => g.gameId) });
}
