"use client"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function GameCard({ app }: { app: { appId: number; name: string } }) {
    return (
        <Card
            key={app.appId}
            className="w-full max-w-md rounded-2xl shadow-md hover:shadow-lg transition-shadow bg-background"
        >
            <CardHeader>
                <CardTitle className="text-lg font-semibold truncate">
                    {app.name}
                </CardTitle>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground">
                <p>App ID: {app.appId}</p>
            </CardContent>

            <CardFooter className="flex justify-end">
                <Button
                    variant="default"
                    onClick={async () => {
                        await fetch("/api/steam/games/play", {
                            method: "POST",
                            body: JSON.stringify({ game: app.appId }),
                        })
                    }}
                >
                    Add
                </Button>
            </CardFooter>
        </Card>
    )
}
