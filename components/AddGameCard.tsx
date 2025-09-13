"use client"
import {useState} from "react";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";

export default function AddGameCard() {
    const [newGame, setNewGame] = useState("");

    async function handleSubmit() {
        await fetch("/api/steam/games/play", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ game: Number(newGame) }),
        });
        setNewGame("");
    }

    return (
        <Card className="mb-6">
            <CardContent className="flex gap-2 p-4">
                <Input
                    placeholder="Enter game ID"
                    value={newGame}
                    onChange={(e) => setNewGame(e.target.value)}
                />
                <Button onClick={handleSubmit}>Add</Button>
            </CardContent>
        </Card>
    )
}