"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [games, setGames] = useState<number[]>([]);
  const [newGame, setNewGame] = useState("");

  // Fetch current games from DB
  async function fetchGames() {
    const res = await fetch("/api/games");
    const data = await res.json();
    setGames(data.games);
  }

  useEffect(() => {
    fetchGames();
  }, []);

  // Add game
  async function addGame() {
    if (!newGame) return;
    await fetch("/api/steam/games/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game: Number(newGame) }),
    });

    setNewGame("");
    fetchGames();
  }

  // Remove game
  async function removeGame(id: number) {
    await fetch("/api/steam/games/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game: id}),
    });

    fetchGames();
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Steam Game Dashboard</h1>

      <Card className="mb-6">
        <CardContent className="flex gap-2 p-4">
          <Input
            placeholder="Enter game ID"
            value={newGame}
            onChange={(e) => setNewGame(e.target.value)}
          />
          <Button onClick={addGame}>Add</Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {games.map((id) => (
          <Card key={id}>
            <CardContent className="flex items-center justify-between p-4">
              <span className="font-mono">{id}</span>
              <Button variant="destructive" onClick={() => removeGame(id)}>
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
